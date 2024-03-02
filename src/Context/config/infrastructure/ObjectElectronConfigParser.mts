import { ElectronConfig } from '../domain/ElectronConfig.mjs';
import { LoaderConfig } from '../domain/LoaderConfig.mjs';
import { MainConfig } from '../domain/MainConfig.mjs';
import { OutputConfig } from '../domain/OutputConfig.mjs';
import { PreloadConfig } from '../domain/PreloadConfig.mjs';
import { RendererConfig } from '../domain/RendererConfig.mjs';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from '../domain/ResourceConfig.mjs';

export abstract class ObjectElectronConfigParser {
  parseElectronConfig(electronConfig: any): ElectronConfig {
    try {
      let output = './dist';

      if (electronConfig.output !== undefined) {
        if (typeof electronConfig.output !== 'string') throw new Error('Output must be a string');

        output = electronConfig.output;
      }

      if (electronConfig.main === undefined) throw new Error('Main config is required');

      const mainConfig: MainConfig = this.parseMainConfig(electronConfig.main);

      if (electronConfig.renderers === undefined) throw new Error('Renderer config is required');

      let renderersConfig: RendererConfig[];

      if (Array.isArray(electronConfig.renderers)) {
        renderersConfig = electronConfig.renderers.map((rendererConfig: any) => {
          this.parseRendererConfig(rendererConfig, mainConfig.output);
        });
      } else {
        renderersConfig = [this.parseRendererConfig(electronConfig.renderers, mainConfig.output)];
      }

      let resourceConfig: ResourceConfig[];

      if (electronConfig.resources === undefined) {
        resourceConfig = [];
      } else if (Array.isArray(electronConfig.resources)) {
        resourceConfig = electronConfig.resources.map((resourceConfig: any) => {
          return this.parseResourceConfig(resourceConfig, output);
        });
      } else {
        resourceConfig = [this.parseResourceConfig(electronConfig.resources, output)];
      }

      return new ElectronConfig(output, mainConfig, renderersConfig, resourceConfig);
    } catch (error: any) {
      throw new Error(`Invalid config file: ${error.message}`);
    }
  }

  /**
   * Parses the main config object from the yaml file
   *
   * @param {any} mainConfig - Main config object
   * @returns {MainConfig} - Main config object
   */
  parseMainConfig(mainConfig: any): MainConfig {
    if (typeof mainConfig.entry !== 'string') throw new Error('Main entry point must be a string');

    const entryPoint: string = mainConfig.entry;

    if (mainConfig.output === undefined) throw new Error('Main output is required');

    const outputConfig: OutputConfig = this.parseOutputConfig(mainConfig.output);

    let preloadConfig: PreloadConfig[];

    if (mainConfig.preloads === undefined) {
      preloadConfig = [];
    } else if (Array.isArray(mainConfig.preloads)) {
      preloadConfig = mainConfig.preloads.map(this.parsePreloadConfig);
    } else {
      preloadConfig = [this.parsePreloadConfig(mainConfig.preloads, outputConfig)];
    }

    let loaderConfig: LoaderConfig[];

    if (mainConfig.loaders === undefined) {
      loaderConfig = [];
    } else if (Array.isArray(mainConfig.loaders)) {
      loaderConfig = mainConfig.loaders.map(this.parseLoaderConfig);
    } else {
      throw new Error('Main loaders must be an array');
    }

    let exclude: string[];

    if (mainConfig.exclude === undefined) {
      exclude = [];
    } else if (Array.isArray(mainConfig.exclude)) {
      exclude = mainConfig.exclude;
    } else {
      throw new Error('Main exclude must be an array');
    }

    let baseConfigEntryPoint: string | undefined = undefined;

    if (mainConfig.esbuild !== undefined) {
      if (typeof mainConfig.esbuild !== 'string') throw new Error('Base config entry point must be a string');

      baseConfigEntryPoint = mainConfig.esbuild;
    }

    return new MainConfig(entryPoint, outputConfig, preloadConfig, loaderConfig, exclude, baseConfigEntryPoint);
  }

  parseRendererConfig(rendererConfig: any, defaultOutputConfig: OutputConfig): RendererConfig {
    if (typeof rendererConfig.html !== 'string') throw new Error('Renderer HTML must be a string');

    const htmlEntryPoint: string = rendererConfig.html;

    if (typeof rendererConfig.entry !== 'string') throw new Error('Renderer entry point is required');

    const entryPoint: string = rendererConfig.entry;

    let outputConfig: OutputConfig;

    if (preloadConfig.output === undefined) {
      throw new Error('Preload output is required');
    } else {
      const preloadDir = rendererConfig.output.directory;
      const preloadFile = rendererConfig.output.filename;

      if (preloadDir && typeof preloadDir !== 'string') throw new Error('Renderer output directory must be a string');

      if (typeof preloadFile !== 'string') throw new Error('Preload file name must be a string');

      if (!preloadDir) {
        outputConfig = new OutputConfig(defaultOutputConfig.directory, preloadFile);
      } else {
        outputConfig = new OutputConfig(preloadDir, preloadFile);
      }
    }

    let loaderConfig: LoaderConfig[];

    if (rendererConfig.loader === undefined) {
      loaderConfig = [];
    } else if (Array.isArray(rendererConfig.loader)) {
      loaderConfig = rendererConfig.loader.map(this.parseLoaderConfig);
    } else {
      throw new Error('Renderer loaders must be an array');
    }

    let exclude: string[];

    if (rendererConfig.exclude === undefined) {
      exclude = [];
    } else if (Array.isArray(rendererConfig.exclude)) {
      exclude = rendererConfig.exclude;
    } else {
      throw new Error('Renderer exclude must be an array');
    }

    if (typeof rendererConfig.devPort !== 'number') throw new Error('Renderer dev port must be a number');

    const devPort: number = rendererConfig.devPort;

    let baseConfigEntryPoint: string | undefined = undefined;

    if (rendererConfig.plugins !== undefined) {
      if (typeof rendererConfig.esbuild !== 'string') throw new Error('Plugins entry point must be a string');

      baseConfigEntryPoint = rendererConfig.esbuild;
    }

    return new RendererConfig(
      htmlEntryPoint,
      entryPoint,
      outputConfig,
      loaderConfig,
      exclude,
      devPort,
      baseConfigEntryPoint,
    );
  }

  parseResourceConfig(resourceConfig: any, defaultOutputDirectory: string): ResourceConfig {
    if (typeof resourceConfig === 'string') return new SimpleResourceConfig(resourceConfig, defaultOutputDirectory);

    if (typeof resourceConfig.from !== 'string') throw new Error('Resource from must be a string');

    if (resourceConfig.to === undefined) return new SimpleResourceConfig(resourceConfig.from, defaultOutputDirectory);
    if (typeof resourceConfig.to === 'string') {
      return new SimpleResourceConfig(resourceConfig.from, resourceConfig.to);
    } else {
      const outputConfig: OutputConfig = this.parseOutputConfig(resourceConfig.to);
      return new CustomResourceConfig(resourceConfig.from, outputConfig);
    }
  }

  parseLoaderConfig(loaderConfig: any): LoaderConfig {
    if (typeof loaderConfig.extension !== 'string') throw new Error('Loader extension must be a string');

    if (typeof loaderConfig.loader !== 'string') throw new Error('Loader loader must be a string');

    return new LoaderConfig(loaderConfig.extension, loaderConfig.loader);
  }

  parseOutputConfig(outputConfig: any): OutputConfig {
    if (typeof outputConfig.directory !== 'string') throw new Error('Output directory must be a string');

    if (typeof outputConfig.filename !== 'string') throw new Error('Output file name must be a string');

    return new OutputConfig(outputConfig.directory, outputConfig.filename);
  }

  parsePreloadConfig(preloadConfig: any, defaultOutputConfig: OutputConfig): PreloadConfig {
    if (typeof preloadConfig.entry !== 'string') throw new Error('Preload entry point must be a string');

    const entryPoint: string = preloadConfig.entry;

    let outputConfig: OutputConfig;

    if (preloadConfig.output === undefined) {
      throw new Error('Preload output is required');
    } else {
      const preloadDir = preloadConfig.output.directory;
      const preloadFile = preloadConfig.output.filename;

      if (preloadDir && typeof preloadDir !== 'string') throw new Error('Preload output directory must be a string');

      if (typeof preloadFile !== 'string') throw new Error('Preload file name must be a string');

      if (!preloadDir) {
        outputConfig = new OutputConfig(defaultOutputConfig.directory, preloadFile);
      } else {
        outputConfig = new OutputConfig(preloadDir, preloadFile);
      }
    }

    if (typeof preloadConfig.reload !== 'boolean') throw new Error('Preload reload must be a boolean');

    const reloadMainProcess: boolean = preloadConfig.reload;

    let loaderConfig: LoaderConfig[];

    if (preloadConfig.loader === undefined) {
      loaderConfig = [];
    } else if (Array.isArray(preloadConfig.loader)) {
      loaderConfig = preloadConfig.loader.map(this.parseLoaderConfig);
    } else {
      throw new Error('Preload loaders must be an array');
    }

    let exclude: string[];

    if (preloadConfig.exclude === undefined) {
      exclude = [];
    } else if (Array.isArray(preloadConfig.exclude)) {
      exclude = preloadConfig.exclude;
    } else {
      throw new Error('Preload exclude must be an array');
    }

    let baseConfigEntryPoint: string | undefined = undefined;

    if (preloadConfig.plugins !== undefined) {
      if (typeof preloadConfig.esbuild !== 'string') throw new Error('Preload plugins entry point must be a string');

      baseConfigEntryPoint = preloadConfig.esbuild;
    }

    return new PreloadConfig(entryPoint, outputConfig, reloadMainProcess, loaderConfig, exclude, baseConfigEntryPoint);
  }
}
