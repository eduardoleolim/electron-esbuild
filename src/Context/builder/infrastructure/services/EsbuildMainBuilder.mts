import chokidar from 'chokidar';
import debounce from 'debounce';
import esbuild, { BuildContext, BuildOptions } from 'esbuild';
import * as path from 'path';

import { MainConfig } from '../../../config/domain/MainConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';
import { getDependencies } from '../../../shared/infrastructure/getDependencies.mjs';
import { getEsbuildBaseConfig } from '../utils/getEsbuildBaseConfig.mjs';
import { MainProcess, MainProcessDispatcher } from './MainProcessDispatcher.mjs';

export class EsbuildMainBuilder {
  private readonly loaders: ReadonlyArray<string>;
  private readonly logger: Logger;

  constructor(loaders: ReadonlyArray<string>, logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  public async build(output: string, config: MainConfig): Promise<void> {
    try {
      this.logger.log('MAIN-BUILDER', 'Building main electron process');

      const buildOptions = await this.loadMainEsbuildOptions(output, config);
      await esbuild.build(buildOptions);

      this.logger.log('MAIN-BUILDER', 'Build finished');
    } catch (error: any) {
      this.logger.error('MAIN-BUILDER', error.message);
    }
  }

  public async develop(output: string, config: MainConfig): Promise<void> {
    let currentProcess: MainProcess | undefined = undefined;
    const context = await this.generateEsbuilContext(output, config);
    let dependencies = this.resolveDependencies(config);
    const watcher = chokidar.watch(dependencies);
    const dispatcher = new MainProcessDispatcher(this.logger);

    watcher
      .on('ready', async () => {
        try {
          this.logger.log('MAIN-BUILDER', 'Building main electron process');
          await context.rebuild();
          this.logger.log('MAIN-BUILDER', 'Main process built');
          currentProcess = dispatcher.dispatchProcess(output, config);
        } catch (error: any) {
          this.logger.error('MAIN-BUILDER', error.message);
          this.logger.log('MAIN-BUILDER', 'The main process will not be started');
        } finally {
          this.logger.log('MAIN-BUILDER', 'Watching for changes');
        }
      })
      .on(
        'change',
        debounce(async () => {
          try {
            await context.cancel();
            await context.rebuild();
            this.logger.log('MAIN-BUILDER', 'Main process rebuilt');

            watcher.unwatch(dependencies);
            dependencies = this.resolveDependencies(config);
            watcher.add(dependencies);

            if (currentProcess !== undefined) {
              dispatcher.killProcess(currentProcess);
            }
            currentProcess = dispatcher.dispatchProcess(output, config);
          } catch (error: any) {
            this.logger.error('MAIN-BUILDER', error.message);
          }
        }, 1000),
      );

    process.on('SIGINT', async () => {
      await watcher.close();
      await context.cancel();
      await context.dispose();
    });
  }

  private resolveDependencies(config: MainConfig): string[] {
    const dependencies: string[] = [];
    dependencies.push(...getDependencies(path.resolve(config.entryPoint)));

    config.preloadConfigs.forEach((preloadConfig) => {
      if (preloadConfig.reloadMainProcess) {
        const preloadDependencies = getDependencies(path.resolve(preloadConfig.entryPoint));
        dependencies.push(...preloadDependencies);
      }
    });

    return dependencies;
  }

  private async generateEsbuilContext(output: string, config: MainConfig): Promise<BuildContext> {
    const esbuildOptions = await this.loadMainEsbuildOptions(output, config);
    return await esbuild.context(esbuildOptions);
  }

  public async loadMainEsbuildOptions(output: string, config: MainConfig): Promise<BuildOptions> {
    const outputFileDirectory = path.resolve(process.cwd(), output, config.output.directory, config.output.filename);
    const external = ['electron', ...config.excludedLibraries];
    const loaders: any = {};

    for (const loader of config.loaderConfigs) {
      if (!this.loaders.includes(loader.loaderName)) {
        this.logger.warn('MAIN-BUILDER', `Loader ${loader.loaderName} not found`);
      } else {
        loaders[loader.fileExtension] = loader.loaderName;
      }
    }

    let esbuildOptions: BuildOptions = {};
    if (config.baseConfigEntryPoint !== undefined) {
      try {
        esbuildOptions = await getEsbuildBaseConfig(config.baseConfigEntryPoint);
        this.logger.info('MAIN-BUILDER', `Plugins loaded from <${config.baseConfigEntryPoint}>`);
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
      sourcemap: process.env.NODE_ENV === 'production' ? false : 'linked',
      define:
        esbuildOptions.define === undefined
          ? { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` }
          : { ...esbuildOptions.define, 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
    };
  }
}
