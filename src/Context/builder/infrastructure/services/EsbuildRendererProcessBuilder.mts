import debounce from 'debounce';
import esbuild, { BuildContext, BuildOptions, Loader, ServeOptions } from 'esbuild';
import * as fs from 'fs';
import path from 'path';

import { RendererConfig } from '../../../config/domain/RendererConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';
import { findFreePort } from '../../../shared/infrastructure/findFreePort.mjs';
import { getDependencies } from '../../../shared/infrastructure/getDependencies.mjs';
import { RendererProcessBuilderService } from '../../domain/RendererProcessBuilderService.mjs';
import { getEsbuildBaseConfig } from '../utils/getEsbuildBaseConfig.mjs';
import { RendererHotReloadServer, RendererHotReloadServerOptions } from './RendererHotReloadServer.mjs';

type LoadersInput = Record<string, Loader>;

export class EsbuildRendererProcessBuilder implements RendererProcessBuilderService {
  private readonly loaders: readonly string[];
  private readonly logger: Logger;

  constructor(loaders: readonly string[], logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  public async build(output: string, config: RendererConfig): Promise<void> {
    try {
      this.logger.log('RENDERER-BUILDER', 'Building renderer electron process');

      const esbuildOptions = await this.loadRendererEsbuildOptions(output, config);
      await esbuild.build(esbuildOptions);
      await this.copyHtml(output, config);

      this.logger.log('RENDERER-BUILDER', 'Build finished');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('RENDERER-BUILDER', error.message);
      } else {
        this.logger.error('RENDERER-BUILDER', `An error occurred while building the renderer process.\n${error}`);
      }
    }
  }

  public async develop(output: string, config: RendererConfig, preloadEntryPoints: string[]): Promise<void> {
    const context = await this.generateEsbuilContext(output, config);
    const host = '127.0.0.1';
    const portContext = await findFreePort(10000, true);
    const hotReloadPort = await findFreePort(35729, true);
    let dependencies = this.resolveDependencies(config, preloadEntryPoints);
    const outputDirectory = path.resolve(output, config.output.directory);
    const serveOptions: ServeOptions = {
      port: portContext,
      host: host,
      servedir: outputDirectory
    };
    const hotReloadServerOptions: RendererHotReloadServerOptions = {
      dependencies: dependencies,
      esbuildHost: host,
      esbuildPort: portContext,
      hotReloadHost: host,
      hotReloadPort: hotReloadPort
    };

    try {
      await context.rebuild();
      this.logger.info('RENDERER-BUILDER', 'Renderer process built');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('RENDERER-BUILDER', error.message);
      } else {
        this.logger.error('RENDERER-BUILDER', `An error occurred while building the renderer process.\n${error}`);
      }
    } finally {
      this.logger.info('RENDERER-BUILDER', 'Watching for changes');
    }

    await context.serve(serveOptions);
    const hotReloadServer = new RendererHotReloadServer(hotReloadServerOptions, this.logger);

    const watcher = hotReloadServer.watcher;
    watcher.on('ready', async () => {
      await this.copyHtmlInDevelop(output, config);

      watcher.on(
        'change',
        debounce(async () => {
          await this.copyHtmlInDevelop(output, config);
          watcher.unwatch(dependencies);
          dependencies = this.resolveDependencies(config, preloadEntryPoints);
          watcher.add(dependencies);

          hotReloadServer.refresh();
          this.logger.info('RENDERER-BUILDER', 'Change in renderer source detected');
        }, 1000)
      );
    });

    await this.copyHtmlInDevelop(output, config);

    hotReloadServer.listen(config.devPort, host);

    process.on('SIGINT', async () => {
      await context.cancel();
      await context.dispose();
      hotReloadServer.close();
    });
  }

  private resolveDependencies(config: RendererConfig, preloadEntryPoints: string[]): string[] {
    const dependencies = getDependencies(config.entryPoint);
    dependencies.push(path.resolve(process.cwd(), config.htmlEntryPoint));

    for (const preloadEntryPoint of preloadEntryPoints) {
      dependencies.push(...getDependencies(preloadEntryPoint));
    }

    return dependencies;
  }

  private async generateEsbuilContext(output: string, config: RendererConfig): Promise<BuildContext> {
    const esbuildOptions = await this.loadRendererEsbuildOptions(output, config);
    return await esbuild.context(esbuildOptions);
  }

  public async loadRendererEsbuildOptions(output: string, config: RendererConfig): Promise<BuildOptions> {
    const outputFileDirectory = path.resolve(process.cwd(), output, config.output.directory, config.output.filename);
    const external = ['electron', ...config.excludedLibraries];
    const loaders: LoadersInput = {};

    for (const loader of config.loaderConfigs) {
      if (!this.loaders.includes(loader.loaderName)) {
        this.logger.warn('RENDERER-BUILDER', `Loader ${loader.loaderName} not found`);
      } else {
        loaders[loader.fileExtension] = loader.loaderName as Loader;
      }
    }

    let esbuildOptions: BuildOptions = {};
    if (config.baseConfigEntryPoint !== undefined) {
      try {
        esbuildOptions = await getEsbuildBaseConfig(config.baseConfigEntryPoint);
        this.logger.info('RENDERER-BUILDER', `Plugins loaded from <${config.baseConfigEntryPoint}>`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error('RENDERER-BUILDER', error.message);
        } else {
          this.logger.error('RENDERER-BUILDER', `An error occurred while building the renderer process.\n${error}`);
        }
      }
    }

    return {
      ...esbuildOptions,
      platform: 'browser',
      entryPoints: [config.entryPoint],
      outfile: outputFileDirectory,
      bundle: true,
      minify: process.env.NODE_ENV === 'production',
      external: esbuildOptions.external === undefined ? external : [...esbuildOptions.external, ...external],
      loader: esbuildOptions.loader === undefined ? loaders : { ...esbuildOptions.loader, ...loaders },
      sourcemap: process.env.NODE_ENV === 'production' ? false : 'linked',
      define:
        esbuildOptions.define === undefined
          ? { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` }
          : { ...esbuildOptions.define, 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` }
    };
  }

  private async copyHtml(output: string, config: RendererConfig): Promise<void> {
    const htmlOutputDirectory = path.resolve(process.cwd(), output, config.output.directory, 'index.html');
    const htmlInputDirectory = path.resolve(process.cwd(), config.htmlEntryPoint);

    if (!fs.existsSync(htmlInputDirectory)) {
      this.logger.error('RENDERER-BUILDER', `Html file not found in <${htmlInputDirectory}>`);
      throw new Error(`Html file not found in <${htmlInputDirectory}>`);
    }

    // Add renderer script to html
    const scriptRelativePath = path.relative(
      path.dirname(htmlOutputDirectory),
      path.resolve(process.cwd(), output, config.output.directory, config.output.filename)
    );
    let htmlContent = fs.readFileSync(htmlInputDirectory, 'utf-8');
    htmlContent = htmlContent.replace(
      '</head>',
      `  <script src="${scriptRelativePath}" defer></script>
  </head>`
    );

    // if exists, add css link to html
    const cssDirectory = path.resolve(
      process.cwd(),
      output,
      config.output.directory,
      config.output.filename.replace(path.extname(config.output.filename), '.css')
    );
    const cssRelativePath = path.relative(path.dirname(htmlOutputDirectory), cssDirectory);
    if (fs.existsSync(cssDirectory)) {
      htmlContent = htmlContent.replace(
        '</head>',
        `  <link rel="stylesheet" href="${cssRelativePath}">
</head>`
      );
    }

    fs.mkdirSync(path.dirname(htmlOutputDirectory), { recursive: true });
    fs.writeFileSync(htmlOutputDirectory, htmlContent, 'utf-8');
  }

  private async copyHtmlInDevelop(output: string, config: RendererConfig): Promise<void> {
    await this.copyHtml(output, config);

    const htmlOutputDirectory = path.resolve(process.cwd(), output, config.output.directory, 'index.html');

    const htmlContent = fs.readFileSync(htmlOutputDirectory, 'utf-8').replace(
      '</head>',
      `  <script src="/livereload.js?snipver=1" defer></script>
</head>`
    );

    fs.writeFileSync(htmlOutputDirectory, htmlContent, 'utf-8');
  }
}
