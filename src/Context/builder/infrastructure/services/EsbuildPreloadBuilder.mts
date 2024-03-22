import chokidar from 'chokidar';
import debounce from 'debounce';
import esbuild, { BuildContext, BuildOptions } from 'esbuild';
import path from 'path';

import { PreloadConfig } from '../../../config/domain/PreloadConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';
import { getDependencies } from '../../../shared/infrastructure/getDependencies.mjs';
import { PreloadBuilderService } from '../../domain/PreloadBuilderService.mjs';
import { getEsbuildBaseConfig } from '../utils/getEsbuildBaseConfig.mjs';

export class EsbuildPreloadBuilder implements PreloadBuilderService {
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
    const watcher = chokidar.watch(dependencies);

    watcher
      .on('ready', async () => {
        try {
          this.logger.log('PRELOAD-BUILDER', 'Building preload electron process');
          await context.rebuild();
          this.logger.info('PRELOAD-BUILDER', 'Preload process built');
        } catch (error: any) {
          this.logger.error('PRELOAD-BUILDER', error.message);
        } finally {
          this.logger.info('PRELOAD-BUILDER', 'Watching for changes');
        }
      })
      .on(
        'change',
        debounce(async () => {
          try {
            await context.cancel();
            await context.rebuild();
            this.logger.info('PRELOAD-BUILDER', 'Preload process rebuilt');

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

    let esbuildOptions: BuildOptions = {};
    if (config.baseConfigEntryPoint !== undefined) {
      try {
        esbuildOptions = await getEsbuildBaseConfig(config.baseConfigEntryPoint);
        this.logger.info('PRELOAD-BUILDER', `Plugins loaded from <${config.baseConfigEntryPoint}>`);
      } catch (error: any) {
        this.logger.warn('MAIN-BUILDER', error.message);
      }
    }

    return {
      ...esbuildOptions,
      platform: 'node',
      entryPoints: [config.entryPoint],
      outfile: outputFileDirectory,
      bundle: true,
      minify: process.env.NODE_ENV === 'production',
      external: esbuildOptions.external === undefined ? external : [...esbuildOptions.external, ...external],
      loader: esbuildOptions.loader === undefined ? loaders : { ...esbuildOptions.loader, ...loaders },
      sourcemap: process.env.NODE_ENV === 'production' ? false : 'inline',
      define:
        esbuildOptions.define === undefined
          ? { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` }
          : { ...esbuildOptions.define, 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
    };
  }
}
