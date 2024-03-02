import chikidar from 'chokidar';
import { debounce } from 'debounce';
import esbuild, { BuildContext, BuildOptions, Plugin } from 'esbuild';
import * as fs from 'fs';
import path from 'path';

import { RendererConfig } from '../../../config/domain/RendererConfig';
import { Logger } from '../../../shared/domain/Logger';
import { findFreePort } from '../../../shared/infrastructure/findFreePort';
import { getDependencies } from '../../../shared/infrastructure/getDependencies';
import { getEsbuildBaseConfig } from '../utils/getEsbuildBaseConfig';
import { RendererProcessServer } from './RendererProcessServer';

export class EsbuildRendererBuilder {
  private readonly loaders: ReadonlyArray<string>;
  private readonly logger: Logger;

  constructor(loaders: ReadonlyArray<string>, logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  public async build(output: string, config: RendererConfig): Promise<void> {
    this.logger.log('RENDERER-BUILDER', 'Building renderer electron process');

    const esbuildOptions = await this.loadRendererEsbuildOptions(output, config);
    await esbuild.build(esbuildOptions);
    await this.copyHtml(output, config);

    this.logger.log('RENDERER-BUILDER', 'Build finished');
  }

  public async develop(output: string, config: RendererConfig): Promise<void> {
    const context = await this.generateEsbuilContext(output, config);
    const host = '127.0.0.1';
    const portContext = await findFreePort(10000, true);
    const outputDirectory = path.resolve(output, config.output.directory);
    let dependencies = this.resolveDependencies(config);

    await context.rebuild();
    const serveResult = await context.serve({ port: portContext, host: host, servedir: outputDirectory });
    const reloadServer = new RendererProcessServer(outputDirectory, serveResult, this.logger);

    const watcher = chikidar.watch(dependencies);
    watcher
      .on('ready', async () => {
        await this.copyHtmlInDevelop(output, config);
        reloadServer.listen(config.devPort, host);

        this.logger.info('RENDERER-BUILDER', `Renderer process served`);
      })
      .on(
        'change',
        debounce(async () => {
          await this.copyHtmlInDevelop(output, config);
          reloadServer.refresh(outputDirectory);

          watcher.unwatch(dependencies);
          dependencies = this.resolveDependencies(config);
          watcher.add(dependencies);

          this.logger.info(
            'RENDERER-BUILDER',
            `Renderer process rebuilt at <http://${serveResult.host}:${config.devPort}>`,
          );
        }, 1000),
      );

    process.on('SIGINT', async () => {
      await context.cancel();
      await context.dispose();
      reloadServer.stop();
    });
  }

  private resolveDependencies(config: RendererConfig): string[] {
    const dependencies = getDependencies(config.entryPoint);
    dependencies.push(config.htmlEntryPoint);
    return dependencies;
  }

  private async generateEsbuilContext(output: string, config: RendererConfig): Promise<BuildContext> {
    const esbuildOptions = await this.loadRendererEsbuildOptions(output, config);
    return await esbuild.context(esbuildOptions);
  }

  public async loadRendererEsbuildOptions(output: string, config: RendererConfig): Promise<BuildOptions> {
    const plugins: Plugin[] = [];
    const outputFileDirectory = path.resolve(process.cwd(), output, config.output.directory, config.output.filename);
    const external = ['electron', ...config.excludedLibraries];
    const loaders: any = {};

    for (const loader of config.loaderConfigs) {
      if (!this.loaders.includes(loader.loaderName)) {
        this.logger.warn('RENDERER-BUILDER', `Loader ${loader.loaderName} not found`);
      } else {
        loaders[loader.fileExtension] = loader.loaderName;
      }
    }

    let baseEsbuildConfig: BuildOptions = {};
    if (config.baseConfigEntryPoint !== undefined) {
      try {
        baseEsbuildConfig = await getEsbuildBaseConfig(config.baseConfigEntryPoint);
        this.logger.info('MAIN-BUILDER', `Plugins loaded from <${config.baseConfigEntryPoint}>`);
      } catch (error: any) {
        this.logger.warn('MAIN-BUILDER', error.message);
      }
    }

    baseEsbuildConfig.platform = 'node';
    baseEsbuildConfig.entryPoints = [config.entryPoint];
    baseEsbuildConfig.outfile = outputFileDirectory;
    baseEsbuildConfig.bundle = true;
    baseEsbuildConfig.minify = process.env.NODE_ENV !== 'development';
    baseEsbuildConfig.external =
      baseEsbuildConfig.external === undefined ? external : [...baseEsbuildConfig.external, ...external];
    baseEsbuildConfig.loader =
      baseEsbuildConfig.loader === undefined ? loaders : { ...baseEsbuildConfig.loader, ...loaders };
    baseEsbuildConfig.define =
      baseEsbuildConfig.define === undefined
        ? { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` }
        : { ...baseEsbuildConfig.define, 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` };
    baseEsbuildConfig.sourcemap = process.env.NODE_ENV === 'development' ? 'linked' : false;

    return baseEsbuildConfig;
  }

  private async copyHtml(output: string, config: RendererConfig): Promise<void> {
    const htmlOutputDirectory = path.resolve(process.cwd(), output, config.output.directory, 'index.html');
    const htmlInputDirectory = path.resolve(process.cwd(), config.htmlEntryPoint);

    if (!fs.existsSync(htmlInputDirectory)) {
      this.logger.error('RENDERER-BUILDER', `Html file not found in <${htmlInputDirectory}>`);
      throw new Error(`Html file not found in <${htmlInputDirectory}>`);
    }

    // Add preload script to html
    const scriptRelativePath = path.relative(
      path.dirname(htmlOutputDirectory),
      path.resolve(process.cwd(), output, config.output.directory, config.output.filename),
    );
    let htmlContent = fs.readFileSync(htmlInputDirectory, 'utf-8');
    htmlContent = htmlContent.replace(
      '</body>',
      `  <script src="${scriptRelativePath}"></script>
  </body>`,
    );

    // if exists, add css link to html
    const cssDirectory = path.resolve(
      process.cwd(),
      output,
      config.output.directory,
      config.output.filename.replace('.js', '.css'),
    );
    const cssRelativePath = path.relative(path.dirname(htmlOutputDirectory), cssDirectory);
    if (fs.existsSync(cssDirectory)) {
      htmlContent = htmlContent.replace(
        '</head>',
        `  <link rel="stylesheet" href="${cssRelativePath}">
</head>`,
      );
    }

    fs.writeFileSync(htmlOutputDirectory, htmlContent, 'utf-8');
  }

  private async copyHtmlInDevelop(output: string, config: RendererConfig): Promise<void> {
    await this.copyHtml(output, config);

    const htmlOutputDirectory = path.resolve(process.cwd(), output, config.output.directory, 'index.html');

    const htmlContent = fs.readFileSync(htmlOutputDirectory, 'utf-8').replace(
      '</body>',
      `  <script src="/livereload.js?snipver=1"></script>
      </body>`,
    );

    fs.writeFileSync(htmlOutputDirectory, htmlContent, 'utf-8');
  }
}
