import chikidar from 'chokidar';
import { debounce } from 'debounce';
import esbuild, { BuildContext, BuildOptions, Plugin } from 'esbuild';
import path from 'path';

import { MainConfig } from '../../../config/domain/MainConfig';
import { Logger } from '../../../shared/domain/Logger';
import { getDependencies } from '../../../shared/infrastructure/getDependencies';
import { getEsbuildPlugins } from '../utils/getEsbuildPlugins';
import { MainProcessStarter } from './MainProcessStarter';

export class EsbuildMainBuilder {
  private readonly loaders: ReadonlyArray<string>;
  private readonly logger: Logger;

  constructor(loaders: ReadonlyArray<string>, logger: Logger) {
    this.loaders = loaders;
    this.logger = logger;
  }

  public async build(output: string, config: MainConfig): Promise<void> {
    this.logger.log('MAIN-BUILDER', 'Building main electron process');

    const buildOptions = await this.loadMainEsbuildOptions(output, config);
    await esbuild.build(buildOptions);

    this.logger.log('MAIN-BUILDER', 'Build finished');
  }

  public async develop(output: string, config: MainConfig): Promise<void> {
    const context = await this.generateEsbuilContext(output, config);
    let dependencies = this.resolveDependencies(config);
    const watcher = chikidar.watch(dependencies);
    const processStarter = new MainProcessStarter(output, config, this.logger);

    watcher
      .on('ready', async () => {
        this.logger.log('MAIN-BUILDER', 'Building main electron process');
        await context.rebuild();
        this.logger.log('MAIN-BUILDER', 'Main process built');

        processStarter.start();
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

            processStarter.start();
          } catch (error: any) {
            this.logger.error('MAIN-BUILDER', error.message);
          }
        }, 500),
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
    const plugins: Plugin[] = [];
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
