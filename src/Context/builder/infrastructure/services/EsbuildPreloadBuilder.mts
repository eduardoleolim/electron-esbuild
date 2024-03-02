import chikidar from 'chokidar';
import debounce from 'debounce';
import esbuild, { BuildContext, BuildOptions, Plugin } from 'esbuild';
import path from 'path';

import { PreloadConfig } from '../../../config/domain/PreloadConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';
import { getDependencies } from '../../../shared/infrastructure/getDependencies.mjs';
import { getEsbuildBaseConfig } from '../utils/getEsbuildBaseConfig.mjs';

export class EsbuildPreloadBuilder {
  private readonly loaders: ReadonlyArray<string>;
  private readonly logger: Logger;

  constructor(loaders: ReadonlyArray<string>, logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  async build(output: string, config: PreloadConfig): Promise<void> {
    try {
      this.logger.log('PRELOAD-BUILDER', 'Building preload electron process');

      const esbuildOptions = await this.loadPreloadEsbuildOptions(output, config);
      await esbuild.build(esbuildOptions);

      this.logger.log('PRELOAD-BUILDER', 'Build finished');
    } catch (error: any) {
      this.logger.error('PRELOAD-BUILDER', error.message);
    }
  }

  async develop(output: string, config: PreloadConfig): Promise<void> {
    let dependencies = getDependencies(config.entryPoint);
    const context = await this.generateEsbuilContext(output, config);
    const watcher = chikidar.watch(dependencies);

    watcher
      .on('ready', async () => {
        try {
          this.logger.log('PRELOAD-BUILDER', 'Building preload electron process');
          await context.rebuild();
          this.logger.log('PRELOAD-BUILDER', 'Preload process built');
        } catch (error: any) {
          watcher.close();
          this.logger.error('PRELOAD-BUILDER', error.message);
        }
      })
      .on(
        'change',
        debounce(async () => {
          try {
            await context.cancel();
            await context.rebuild();
            this.logger.log('PRELOAD-BUILDER', 'Preload process rebuilt');

            watcher.unwatch(dependencies);
            dependencies = getDependencies(config.entryPoint);
            watcher.add(dependencies);
          } catch (error: any) {
            this.logger.error('PRELOAD-BUILDER', error.message);
          }
        }, 500),
      );

    process.on('SIGINT', async () => {
      await watcher.close();
      await context.cancel();
      await context.dispose();
    });
  }

  private async generateEsbuilContext(output: string, config: PreloadConfig): Promise<BuildContext> {
    const esbuildOptions = await this.loadPreloadEsbuildOptions(output, config);
    return await esbuild.context(esbuildOptions);
  }

  async loadPreloadEsbuildOptions(output: string, config: PreloadConfig): Promise<BuildOptions> {
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
}
