import esbuild, { BuildOptions, Plugin } from 'esbuild';
import * as fs from 'fs';
import path from 'path';

import { RendererConfig } from '../../../config/domain/RendererConfig';
import { Logger } from '../../../shared/domain/Logger';
import { getEsbuildPlugins } from '../utils/getEsbuildPlugins';

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

    if (config.pluginsEntryPoint !== undefined) {
      try {
        const pluginsEntry = path.resolve(config.pluginsEntryPoint);
        const externalPlugins = await getEsbuildPlugins(pluginsEntry);
        plugins.push(...externalPlugins);
        this.logger.info('RENDERER-BUILDER', `Loaded plugins from <${config.pluginsEntryPoint}>`);
      } catch (error: any) {
        this.logger.warn('RENDERER-BUILDER', error.message);
      }
    }

    return {
      platform: 'browser',
      entryPoints: [config.entryPoint],
      outfile: outputFileDirectory,
      bundle: true,
      minify: process.env.NODE_ENV === 'production',
      external: external,
      loader: loaders,
      plugins: plugins,
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      sourcemap: process.env.NODE_ENV !== 'production',
    };
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
}
