import { RendererConfig } from '../../../config/domain/RendererConfig';
import esbuild, { BuildOptions } from 'esbuild';
import path from 'path';
import fs from 'fs';
import { MainConfig } from '../../../config/domain/MainConfig';
import { findFreePort } from '../../../shared/infrastructure/findFreePort';
import chokidar from 'chokidar';
import { RendererProcessServer } from './RendererProcessServer';
import { getDependencies } from '../../../shared/infrastructure/getDependencies';
import { isDev, nodeEnv } from '../../../shared/infrastructure/environment';

export class RendererEsbuildElectronBuilder {
  private readonly mainConfig: MainConfig;
  private readonly outputDirectory: string;
  private readonly rendererConfig: RendererConfig;
  private readonly loaders: ReadonlyArray<string>;
  private readonly outRendererFile: string;

  constructor(mainConfig: MainConfig, rendererConfig: RendererConfig, outputDirectory: string, loaders: string[]) {
    this.mainConfig = mainConfig;
    this.rendererConfig = rendererConfig;
    this.outputDirectory = outputDirectory;
    this.loaders = loaders;
    this.outRendererFile = path.resolve(
      this.outputDirectory,
      this.rendererConfig.output?.directory ?? this.mainConfig.output.directory,
      this.rendererConfig.output?.filename ?? 'renderer.js',
    );
  }

  public async build(): Promise<void> {
    console.log('Building renderer process...');
    const buildOptions = this.prepareBuildOptions();
    const context = await esbuild.context<BuildOptions>(buildOptions);
    await context.rebuild();
    await context.cancel();
    await context.dispose();
    this.copyHtml();
    console.log('Renderer process built');
  }

  public async dev(): Promise<void> {
    const buildOptions = this.prepareBuildOptions();
    const context = await esbuild.context<BuildOptions>(buildOptions);
    const host = '127.0.0.1';
    const portContext = await findFreePort(8000);
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

    console.log('Building renderer process...');
    context.serve({ port: portContext, host, servedir }).then(async (result) => {
      console.log('Renderer process built');

      const server = new RendererProcessServer(result, htmlPath, relativeRendererScriptPath, calculateCssRelativePath);

      let sources = getDependencies(path.resolve(this.rendererConfig.entry));
      const watcher = chokidar.watch(sources, { disableGlobbing: false });

      watcher.on('ready', () => {
        watcher.on('all', async (eventName, file) => {
          server.reload(file);

          const newSources = getDependencies(path.resolve(this.rendererConfig.entry));
          const removedSources = sources.filter((s) => !newSources.includes(s));
          const addedSources = newSources.filter((s) => !sources.includes(s));
          sources = newSources;

          watcher.unwatch(removedSources);
          watcher.add(addedSources);
        });
      });

      process.on('exit', async () => {
        server.stop();
        await context.cancel();
        await context.dispose();
      });

      const devPort = await findFreePort(this.rendererConfig.devPort || 8000);
      server.start(devPort, host);
    });
  }

  private prepareBuildOptions(): BuildOptions {
    const external = ['electron'];
    if (this.rendererConfig.exclude !== undefined) {
      external.push(...this.rendererConfig.exclude);
    }

    const loader: any = {};
    if (this.rendererConfig.loaders !== undefined) {
      this.rendererConfig.loaders.forEach((loaderConfig) => {
        if (!this.loaders.includes(loaderConfig.loader)) {
          console.log(`Unknown loader ${loaderConfig.loader} for extension ${loaderConfig.extension}`);
          return;
        }

        loader[loaderConfig.extension] = loaderConfig.loader;
      });
    }

    return {
      platform: 'browser',
      entryPoints: [this.rendererConfig.entry],
      outfile: this.outRendererFile,
      bundle: true,
      minify: !isDev,
      external: external,
      loader: loader,
      define: {
        'process.env.NODE_ENV': `"${nodeEnv}"`,
      },
      sourcemap: isDev,
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
