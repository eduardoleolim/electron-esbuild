import { RendererConfig } from '../../../config/domain/RendererConfig';
import esbuild, { BuildOptions } from 'esbuild';
import path from 'path';
import fs from 'fs';
import { MainConfig } from '../../../config/domain/MainConfig';
import { findFreePort } from '../../../shared/infrastructure/findFreePort';

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
    const outputDirectory = path.resolve(
      this.outputDirectory,
      this.rendererConfig.output?.directory ?? this.mainConfig.output.directory,
    );

    console.log('Building renderer process...');
    const buildOptions = this.prepareBuildOptions();
    const context = await esbuild.context<BuildOptions>(buildOptions);
    await context.rebuild();
    await context.cancel();
    await context.dispose();
    this.copyHtml(outputDirectory);
    console.log('Renderer process built');
  }

  public async dev(): Promise<void> {
    const host = '127.0.0.1';
    const port = this.rendererConfig.devPort || (await findFreePort(8000));
    const servedir = path.resolve(
      this.outputDirectory,
      this.rendererConfig.output?.directory ?? this.mainConfig.output.directory,
    );

    const buildOptions = this.prepareBuildOptions();
    const context = await esbuild.context<BuildOptions>(buildOptions);

    await context.rebuild();
    await context.watch();
    await context.serve({ port, host, servedir });
    this.copyHtml(servedir);

    process.on('exit', async () => {
      await context.cancel();
      await context.dispose();
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
      minify: process.env.NODE_ENV === 'production',
      external: external,
      loader: loader,
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      sourcemap: process.env.NODE_ENV !== 'production',
    };
  }

  private copyHtml(directory: string): void {
    const html = path.resolve(this.rendererConfig.html);
    const outHtml = path.resolve(directory, path.basename(html));
    const relativeRendererScriptPath = path.relative(path.dirname(outHtml), this.outRendererFile);

    if (!fs.existsSync(html)) {
      throw new Error(`Html file not found in <${html}>`);
    }

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    let content = fs.readFileSync(html, 'utf-8').replace(
      '</body>',
      `  <script src="${relativeRendererScriptPath}"></script>
  </body>`,
    );

    if (process.env.NODE_ENV === 'development') {
      content = content.replace(
        '</body>',
        `  <script src="hot-reload.js"></script>
  </body>`,
      );
      this.copyHotReload(directory);
    }

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

  private copyHotReload(directory: string): void {
    const inputPathScript = path.resolve(__dirname, '..', '..', '..', '..', '..', 'scripts', 'hot-reload.js');
    const outputPathScript = path.resolve(directory, 'hot-reload.js');
    fs.copyFileSync(inputPathScript, outputPathScript);
  }
}
