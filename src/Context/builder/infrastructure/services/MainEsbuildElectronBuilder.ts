import { MainConfig } from '../../../config/domain/MainConfig';
import chikidar from 'chokidar';
import debounce from 'debounce';
import esbuild, { BuildContext, BuildOptions, Plugin, PluginBuild } from 'esbuild';
import path from 'path';
import { getDependencies } from '../../../shared/infrastructure/getDependencies';

export class MainEsbuildElectronBuilder {
  private readonly mainConfig: MainConfig;
  private readonly outputDirectory: string;
  private readonly loaders: ReadonlyArray<string>;
  private context?: BuildContext;

  constructor(mainConfig: MainConfig, outputDirectory: string, loaders: string[]) {
    this.mainConfig = mainConfig;
    this.outputDirectory = outputDirectory;
    this.loaders = loaders;
  }

  public async build(): Promise<void> {
    console.log('Building main process...');
    if (this.context !== undefined) {
      await this.context.rebuild();
      return;
    }

    const buildOptions = this.prepareBuildOptions();
    this.context = await esbuild.context<BuildOptions>(buildOptions);
    await this.context.rebuild();

    if (process.env.NODE_ENV === 'production') {
      await this.context.cancel();
      await this.context.dispose();
    }
    console.log('Main process built');
  }

  public async dev(start: () => void): Promise<void> {
    const sources = [
      ...getDependencies(path.resolve(this.mainConfig.entry)),
      ...(this.mainConfig.preloads?.map((preload) => preload.entry) ?? []),
    ];

    const watcher = chikidar.watch(sources);

    watcher.on('ready', () => {
      watcher.on(
        'all',
        debounce(async () => {
          if (this.context) await this.context.cancel();
          await this.build();
          start();
          await watcher.close();
          await this.dev(start);
        }, 500),
      );
    });

    process.on('exit', async () => {
      await watcher.close();
    });
  }

  private prepareBuildOptions(): BuildOptions {
    const outfile = path.resolve(
      this.outputDirectory,
      this.mainConfig.output.directory,
      this.mainConfig.output.filename,
    );

    const external = ['electron'];
    if (this.mainConfig.exclude !== undefined) {
      external.push(...this.mainConfig.exclude);
    }

    const loader: any = {};
    if (this.mainConfig.loaders !== undefined) {
      this.mainConfig.loaders.forEach((loaderConfig) => {
        if (!this.loaders.includes(loaderConfig.loader)) {
          console.log(`Unknown loader ${loaderConfig.loader} for extension ${loaderConfig.extension}`);
          return;
        }

        loader[loaderConfig.extension] = loaderConfig.loader;
      });
    }

    const preloadConfigs: BuildOptions[] = [];
    if (this.mainConfig.preloads !== undefined) {
      this.mainConfig.preloads.forEach((preloadConfig, index) => {
        let outfile;

        if (preloadConfig.output !== undefined) {
          outfile = path.resolve(this.outputDirectory, preloadConfig.output.directory, preloadConfig.output.filename);
        } else {
          outfile = path.resolve(this.outputDirectory, this.mainConfig.output.directory, `preload_${index}.js`);
        }

        preloadConfigs.push({
          platform: 'node',
          entryPoints: [preloadConfig.entry],
          outfile: outfile,
          bundle: true,
          minify: process.env.NODE_ENV !== 'development',
          external: external,
          define: {
            'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
          },
          sourcemap: process.env.NODE_ENV === 'development' ? 'linked' : false,
        });
      });
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
              console.log(error.message);
            }
          });
        });
      },
    };

    return {
      platform: 'node',
      entryPoints: [this.mainConfig.entry],
      outfile: outfile,
      bundle: true,
      minify: process.env.NODE_ENV !== 'development',
      external: external,
      loader: loader,
      plugins: [preloadPlugin],
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      sourcemap: process.env.NODE_ENV === 'development' ? 'linked' : false,
    };
  }
}
