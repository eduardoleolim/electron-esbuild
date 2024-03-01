import esbuild, { BuildOptions, Plugin, context } from 'esbuild';
import path from 'path';

import { MainConfig } from '../../../config/domain/MainConfig';
import { Logger } from '../../../shared/domain/Logger';
import { getEsbuildPlugins } from '../utils/getEsbuildPlugins';

export class EsbuildMainBuilder {
  private readonly loaders: ReadonlyArray<string>;
  private readonly logger: Logger;

  constructor(loaders: ReadonlyArray<string>, logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  public async build(output: string, config: MainConfig): Promise<void> {
    this.logger.log('MAIN-BUILDER', 'Building main electron process');

    const esbuildOptions = await this.loadMainEsbuildOptions(output, config);
    esbuild.build(esbuildOptions);

    this.logger.log('MAIN-BUILDER', 'Build of main electron process finished');
  }

  public async loadMainEsbuildOptions(output: string, config: MainConfig): Promise<BuildOptions> {
    const plugins: Plugin[] = [];
    const outputFileDirectory = path.resolve(process.cwd(), output, config.output.directory, config.output.filename);
    const external = ['electron', ...config.excludedLibraries];
    const loaders: any = {};

    for (const loader of config.loaderConfigs) {
      if (!this.loaders.includes(loader.loaderName)) {
        this.logger.error('MAIN-BUILDER', `Loader ${loader.loaderName} not found`);
      } else {
        loaders[loader.fileExtension] = loader.loaderName;
      }
    }

    if (config.pluginsEntryPoint !== undefined) {
      try {
        const pluginsEntry = path.resolve(config.pluginsEntryPoint);
        const externalPlugins = await getEsbuildPlugins(pluginsEntry);
        plugins.push(...externalPlugins);
        this.logger.info('MAIN-BUILDER', `Plugins loaded from <${config.pluginsEntryPoint}>`);
      } catch (error: any) {
        this.logger.warn('MAIN-BUILDER', error.message);
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
      sourcemap: process.env.NODE_ENV === 'development' ? 'linked' : false,
    };
  }
}
