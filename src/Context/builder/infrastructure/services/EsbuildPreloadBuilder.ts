import esbuild, { BuildOptions, Plugin } from 'esbuild';
import path from 'path';

import { PreloadConfig } from '../../../config/domain/PreloadConfig';
import { Logger } from '../../../shared/domain/Logger';
import { getEsbuildPlugins } from '../utils/getEsbuildPlugins';

export class EsbuildPreloadBuilder {
  private readonly loaders: ReadonlyArray<string>;
  private readonly logger: Logger;

  constructor(loaders: ReadonlyArray<string>, logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  async build(output: string, config: PreloadConfig): Promise<void> {
    this.logger.log('PRELOAD-BUILDER', 'Building preload electron process');

    const esbuildOptions = await this.loadPreloadEsbuildOptions(output, config);
    await esbuild.build(esbuildOptions);

    this.logger.log('PRELOAD-BUILDER', 'Build finished');
  }

  async loadPreloadEsbuildOptions(output: string, config: PreloadConfig): Promise<BuildOptions> {
    const plugins: Plugin[] = [];
    const outputFileDirectory = path.resolve(process.cwd(), output, config.output.directory, config.output.filename);
    const external = ['electron', ...config.excludedLibraries];
    const loaders: any = {};

    for (const loader of config.loaderConfigs) {
      if (!this.loaders.includes(loader.loaderName)) {
        this.logger.warn('PRELOAD-BUILDER', `Loader ${loader.loaderName} not found`);
      } else {
        loaders[loader.fileExtension] = loader.loaderName;
      }
    }

    if (config.pluginsEntryPoint !== undefined) {
      try {
        const pluginsEntry = path.resolve(config.pluginsEntryPoint);
        const externalPlugins = await getEsbuildPlugins(pluginsEntry);
        plugins.push(...externalPlugins);
        this.logger.info('PRELOAD-BUILDER', `Loaded plugins from <${config.pluginsEntryPoint}>`);
      } catch (error: any) {
        this.logger.warn('PRELOAD-BUILDER', error.message);
      }
    }

    return {
      platform: 'node',
      entryPoints: [config.entryPoint],
      outfile: outputFileDirectory,
      bundle: true,
      minify: process.env.NODE_ENV !== 'development',
      external: external,
      loader: loaders,
      plugins: plugins,
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
    };
  }
}
