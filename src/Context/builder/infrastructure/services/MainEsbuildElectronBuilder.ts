import chikidar from 'chokidar';
import debounce from 'debounce';
import esbuild, { BuildContext, BuildOptions, Plugin, PluginBuild, buildSync } from 'esbuild';
import path from 'path';

import { MainConfig } from '../../../config/domain/MainConfig.js';
import { PreloadConfig } from '../../../config/domain/PreloadConfig';
import { Logger } from '../../../shared/domain/Logger.js';
import { getDependencies } from '../../../shared/infrastructure/getDependencies.js';
import { getEsbuildPlugins } from '../utils/getEsbuildPlugins.js';
import { MainProcessStarter } from './MainProcessStarter.js';

export class MainEsbuildElectronBuilder {
  private readonly mainConfig: MainConfig;
  private readonly outputDirectory: string;
  private readonly loaders: ReadonlyArray<string>;
  private readonly logger: Logger;
  private context?: BuildContext;

  constructor(mainConfig: MainConfig, outputDirectory: string, loaders: string[], logger: Logger) {
    this.mainConfig = mainConfig;
    this.outputDirectory = outputDirectory;
    this.loaders = loaders;
    this.logger = logger;
  }

  public async build(): Promise<void> {
    if (this.context !== undefined) {
      this.logger.log('MAIN', 'Rebuilding main process');
      await this.context.rebuild();
      this.logger.log('MAIN', 'Main process rebuilt');
      return;
    }

    this.logger.log('MAIN', 'Building main process');
    const buildOptions = await this.prepareBuildOptions();
    this.context = await esbuild.context<BuildOptions>(buildOptions);
    await this.context.rebuild();
    this.logger.log('MAIN', 'Main process built');

    if (process.env.NODE_ENV === 'production') {
      await this.context.cancel();
      await this.context.dispose();
    }
  }

  public async dev(mainProcessStarter: MainProcessStarter): Promise<void> {
    const sources = this.calculateDependencies();
    const watcher = chikidar.watch(sources);

    watcher.on('ready', () => {
      watcher.on(
        'all',
        debounce(async () => {
          if (this.context) await this.context.cancel();
          await this.build();
          mainProcessStarter.start();
          await watcher.close();
          await this.dev(mainProcessStarter);
        }, 500),
      );
    });

    process.on('exit', async () => {
      await watcher.close();
    });
  }

  private calculateDependencies(): string[] {
    const dependencies: string[] = [];
    dependencies.push(...getDependencies(path.resolve(this.mainConfig.entry)));
    this.mainConfig.preloads.forEach((preloadConfig) => {
      if (!preloadConfig.reload) return;
      dependencies.push(...getDependencies(path.resolve(preloadConfig.entry)));
    });

    return dependencies;
  }

  private async prepareBuildOptions(): Promise<BuildOptions> {
    const mainPlugins: Plugin[] = [];
    const logger = this.logger;

    const outfile = path.resolve(
      this.outputDirectory,
      this.mainConfig.output.directory,
      this.mainConfig.output.filename,
    );

    const external = ['electron', ...this.mainConfig.exclude];

    const loader: any = {};
    this.mainConfig.loaders.forEach((loaderConfig) => {
      if (!this.loaders.includes(loaderConfig.loader)) {
        this.logger.log('MAIN', `Unknown loader <${loaderConfig.loader}> for extension <${loaderConfig.extension}>`);
        return;
      }

      loader[loaderConfig.extension] = loaderConfig.loader;
    });

    const preloadConfigs: BuildOptions[] = [];
    const mainPreloads = this.mainConfig.preloads.filter((preloadConfig) => preloadConfig.reload);
    const preloads = this.mainConfig.preloads.filter((preloadConfig) => !preloadConfig.reload);

    for (let i = 0; i < preloads.length; i++) {
      const preloadConfig = preloads[i];
      const source = getDependencies(path.resolve(preloadConfig.entry));
      const watcher = chikidar.watch(source);
      const buildOptions = await this.preparePreloadBuildOptions(preloadConfig, i);

      watcher.on('ready', () => {
        watcher.on(
          'all',
          debounce(async () => {
            buildSync(buildOptions);
            logger.log('MAIN', `Preload <${preloadConfig.entry}> rebuilt`);
          }, 500),
        );
      });

      process.on('exit', async () => {
        await watcher.close();
      });
    }

    for (let i = 0; i < mainPreloads.length; i++) {
      const preloadConfig = mainPreloads[i];
      const buildOptions = await this.preparePreloadBuildOptions(preloadConfig, i + preloads.length);
      preloadConfigs.push(buildOptions);
    }

    const preloadPlugin: Plugin = {
      name: 'preload',
      setup(build: PluginBuild) {
        build.onStart(() => {
          if (preloadConfigs.length === 0) return;

          preloadConfigs.forEach((preloadConfig) => {
            try {
              build.esbuild.buildSync(preloadConfig);
            } catch (error: any) {
              logger.warn('MAIN', error.message);
            }
          });
        });
      },
    };

    mainPlugins.push(preloadPlugin);

    if (this.mainConfig.pluginsEntry !== undefined) {
      try {
        const pluginsEntry = path.resolve(this.mainConfig.pluginsEntry);
        mainPlugins.push(...(await getEsbuildPlugins(pluginsEntry)));
        logger.info('MAIN', `Plugins loaded from <${this.mainConfig.pluginsEntry}>`);
      } catch (error: any) {
        this.logger.warn('MAIN', error.message);
      }
    }

    return {
      platform: 'node',
      entryPoints: [this.mainConfig.entry],
      outfile: outfile,
      bundle: true,
      minify: process.env.NODE_ENV !== 'development',
      external: external,
      loader: loader,
      plugins: mainPlugins,
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      sourcemap: process.env.NODE_ENV === 'development' ? 'linked' : false,
    };
  }

  private async preparePreloadBuildOptions(preloadConfig: PreloadConfig, index: number): Promise<BuildOptions> {
    let outfile;
    const external = ['electron', ...preloadConfig.exclude];
    const plugins: Plugin[] = [];
    const loader: any = {};
    preloadConfig.loaders.forEach((loaderConfig) => {
      if (!this.loaders.includes(loaderConfig.loader)) {
        this.logger.log('MAIN', `Unknown loader <${loaderConfig.loader}> for extension <${loaderConfig.extension}>`);
        return;
      }

      loader[loaderConfig.extension] = loaderConfig.loader;
    });

    if (preloadConfig.output !== undefined) {
      outfile = path.resolve(this.outputDirectory, preloadConfig.output.directory, preloadConfig.output.filename);
    } else {
      outfile = path.resolve(this.outputDirectory, this.mainConfig.output.directory, `preload_${index}.js`);
    }

    if (preloadConfig.pluginsEntry !== undefined) {
      try {
        const pluginsEntry = path.resolve(preloadConfig.pluginsEntry);
        plugins.push(...(await getEsbuildPlugins(pluginsEntry)));
        this.logger.info('MAIN', `Loaded plugins from <${preloadConfig.pluginsEntry}>`);
      } catch (error: any) {
        this.logger.error('MAIN', error.message);
      }
    }

    return {
      platform: 'node',
      entryPoints: [preloadConfig.entry],
      outfile: outfile,
      bundle: true,
      minify: process.env.NODE_ENV !== 'development',
      external: external,
      loader: loader,
      plugins: plugins,
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
    };
  }
}
