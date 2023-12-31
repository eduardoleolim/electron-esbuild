import chokidar from 'chokidar';
import debounce from 'debounce';
import esbuild, { BuildOptions, Plugin } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { MainConfig } from '../../../config/domain/MainConfig.js';
import { RendererConfig } from '../../../config/domain/RendererConfig.js';
import { Logger } from '../../../shared/domain/Logger.js';
import { findFreePort } from '../../../shared/infrastructure/findFreePort.js';
import { getDependencies } from '../../../shared/infrastructure/getDependencies.js';
import { getEsbuildPlugins } from '../utils/getEsbuildPlugins.js';
import { RendererProcessServer } from './RendererProcessServer.js';

export class RendererEsbuildElectronBuilder {
  private readonly mainConfig: MainConfig;
  private readonly outputDirectory: string;
  private readonly rendererConfig: RendererConfig;
  private readonly loaders: ReadonlyArray<string>;
  private readonly outRendererFile: string;
  private readonly logger: Logger;

  constructor(
    mainConfig: MainConfig,
    rendererConfig: RendererConfig,
    outputDirectory: string,
    loaders: string[],
    logger: Logger,
  ) {
    this.mainConfig = mainConfig;
    this.rendererConfig = rendererConfig;
    this.outputDirectory = outputDirectory;
    this.loaders = loaders;
    this.logger = logger;
    this.outRendererFile = path.resolve(
      this.outputDirectory,
      this.rendererConfig.output?.directory ?? this.mainConfig.output.directory,
      this.rendererConfig.output?.filename ?? 'renderer.js',
    );
  }

  public async build(): Promise<void> {
    this.logger.log('RENDERER', 'Building renderer process');
    const buildOptions = await this.prepareBuildOptions();
    const context = await esbuild.context<BuildOptions>(buildOptions);
    await context.rebuild();
    await context.cancel();
    await context.dispose();
    this.copyHtml();
    this.logger.log('RENDERER', 'Renderer process built');
  }

  public async dev(): Promise<void> {
    const buildOptions = await this.prepareBuildOptions();
    const context = await esbuild.context<BuildOptions>(buildOptions);
    const host = '127.0.0.1';
    const portContext = await findFreePort(8000, true);
    const servedir = path.resolve(
      this.outputDirectory,
      this.rendererConfig.output?.directory ?? this.mainConfig.output.directory,
    );
    const htmlPath = path.resolve(this.rendererConfig.html);
    const outHtml = path.resolve(servedir, path.basename(htmlPath));
    const outCss = path.resolve(
      path.dirname(this.outRendererFile),
      path.basename(this.outRendererFile, '.js') + '.css',
    );
    const relativeRendererScriptPath = path.relative(path.dirname(outHtml), this.outRendererFile);

    function calculateCssRelativePath(): string | undefined {
      if (!fs.existsSync(outCss)) return undefined;

      return path.relative(path.dirname(outHtml), outCss);
    }

    this.logger.log('RENDERER', 'Building renderer process');
    context.serve({ port: portContext, host, servedir }).then(async (result) => {
      this.logger.log('RENDERER', 'Renderer process built');

      const server = new RendererProcessServer(
        result,
        htmlPath,
        relativeRendererScriptPath,
        calculateCssRelativePath,
        this.logger,
      );

      let sources = getDependencies(path.resolve(this.rendererConfig.entry));
      const watcher = chokidar.watch(sources, { disableGlobbing: false });

      watcher.on('ready', () => {
        watcher.on(
          'all',
          debounce((eventName, file) => {
            server.reload(file);

            const newSources = getDependencies(path.resolve(this.rendererConfig.entry));
            const removedSources = sources.filter((s) => !newSources.includes(s));
            const addedSources = newSources.filter((s) => !sources.includes(s));
            sources = newSources;

            watcher.unwatch(removedSources);
            watcher.add(addedSources);
          }, 200),
        );
      });

      process.on('exit', async () => {
        server.stop();
        await context.cancel();
        await context.dispose();
      });

      const devPort = await findFreePort(this.rendererConfig.devPort || 8000, true);
      server.start(devPort, host);
    });
  }

  private async prepareBuildOptions(): Promise<BuildOptions> {
    const plugins: Plugin[] = [];

    const external = ['electron', ...this.rendererConfig.exclude];

    const loader: any = {};
    this.rendererConfig.loaders.forEach((loaderConfig) => {
      if (!this.loaders.includes(loaderConfig.loader)) {
        this.logger.log(
          'RENDERER',
          `Unknown loader <${loaderConfig.loader}> for extension <${loaderConfig.extension}>`,
        );
        return;
      }

      loader[loaderConfig.extension] = loaderConfig.loader;
    });

    if (this.rendererConfig.pluginsEntry !== undefined) {
      try {
        const pluginsEntry = path.resolve(this.rendererConfig.pluginsEntry);
        plugins.push(...(await getEsbuildPlugins(pluginsEntry)));
        this.logger.info('RENDERER', `Loaded plugins from <${this.rendererConfig.pluginsEntry}>`);
      } catch (error: any) {
        this.logger.warn('RENDERER', error.message);
      }
    }

    return {
      platform: 'browser',
      entryPoints: [this.rendererConfig.entry],
      outfile: this.outRendererFile,
      bundle: true,
      minify: process.env.NODE_ENV === 'production',
      external: external,
      loader: loader,
      plugins: plugins,
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      sourcemap: process.env.NODE_ENV !== 'production',
    };
  }

  private copyHtml(): void {
    const html = path.resolve(this.rendererConfig.html);
    const outDir = path.resolve(
      this.outputDirectory,
      this.rendererConfig.output?.directory ?? this.mainConfig.output.directory,
    );
    const outHtml = path.resolve(outDir, path.basename(html));
    const relativeRendererScriptPath = path.relative(path.dirname(outHtml), this.outRendererFile);

    if (!fs.existsSync(html)) {
      throw new Error(`Html file not found in <${html}>`);
    }

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    let content = fs.readFileSync(html, 'utf-8').replace(
      '</body>',
      `  <script src="${relativeRendererScriptPath}"></script>
  </body>`,
    );

    const outCss = path.resolve(
      path.dirname(this.outRendererFile),
      path.basename(this.outRendererFile, '.js') + '.css',
    );

    if (fs.existsSync(outCss)) {
      const outCssRelative = path.relative(path.dirname(outHtml), outCss);

      content = content.replace(
        '</head>',
        `  <link rel="stylesheet" href="${outCssRelative}">
</head>`,
      );
    }

    fs.writeFileSync(outHtml, content, 'utf-8');
  }
}
