import { ElectronConfig } from '../domain/ElectronConfig';
import { LoaderConfig } from '../domain/LoaderConfig';
import { MainConfig } from '../domain/MainConfig';
import { OutputConfig } from '../domain/OutputConfig';
import { PreloadConfig } from '../domain/PreloadConfig';
import { RendererConfig } from '../domain/RendererConfig';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from '../domain/ResourceConfig';

export abstract class ObjectElectronConfigParser {
  parseElectronConfig(electronConfig: any): ElectronConfig {
    try {
      if (typeof electronConfig.output !== 'string') throw new Error('Output must be a string');

      const output: string = electronConfig.output;

      if (electronConfig.main === undefined) throw new Error('Main config is required');

      const mainConfig: MainConfig = this.parseMainConfig(electronConfig.main);

      if (electronConfig.renderer === undefined) throw new Error('Renderer config is required');

      let rendererConfig: RendererConfig[];

      if (Array.isArray(electronConfig.renderer)) {
        rendererConfig = electronConfig.renderer.map(this.parseRendererConfig);
      } else {
        rendererConfig = [this.parseRendererConfig(electronConfig.renderer, mainConfig.output)];
      }

      let resourceConfig: ResourceConfig[];

      if (electronConfig.resource === undefined) {
        resourceConfig = [];
      } else if (Array.isArray(electronConfig.resource)) {
        resourceConfig = electronConfig.resource.map(this.parseResourceConfig);
      } else {
        resourceConfig = [this.parseResourceConfig(electronConfig.resource)];
      }

      return new ElectronConfig(output, mainConfig, rendererConfig, resourceConfig);
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

    if (mainConfig.preload === undefined) {
      preloadConfig = [];
    } else if (Array.isArray(mainConfig.preload)) {
      preloadConfig = mainConfig.preload.map(this.parsePreloadConfig);
    } else {
      preloadConfig = [this.parsePreloadConfig(mainConfig.preload, outputConfig)];
    }

    let loaderConfig: LoaderConfig[];

    if (mainConfig.loader === undefined) {
      loaderConfig = [];
    } else if (Array.isArray(mainConfig.loader)) {
      loaderConfig = mainConfig.loader.map(this.parseLoaderConfig);
    } else {
      loaderConfig = [this.parseLoaderConfig(mainConfig.loader)];
    }

    let exclude: string[];

    if (mainConfig.exclude === undefined) {
      exclude = [];
    } else if (Array.isArray(mainConfig.exclude)) {
      exclude = mainConfig.exclude;
    } else {
      throw new Error('Main exclude must be an array');
    }

    let pluginsEntryPoint: string | undefined = undefined;

    if (mainConfig.plugins !== undefined) {
      if (typeof mainConfig.plugins !== 'string') throw new Error('Plugins entry point must be a string');
      pluginsEntryPoint = mainConfig.plugins;
    }

    return new MainConfig(entryPoint, outputConfig, preloadConfig, loaderConfig, exclude, pluginsEntryPoint);
  }

  parseRendererConfig(rendererConfig: any, defaultOutputConfig: OutputConfig): RendererConfig {
    if (typeof rendererConfig.html !== 'string') throw new Error('Renderer HTML must be a string');

    const htmlEntryPoint: string = rendererConfig.html;

    if (typeof rendererConfig.entry !== 'string') throw new Error('Renderer entry point is required');

    const entryPoint: string = rendererConfig.entry;

    let outputConfig: OutputConfig;

    if (rendererConfig.output === undefined) {
      outputConfig = defaultOutputConfig;
    } else {
      outputConfig = this.parseOutputConfig(rendererConfig.output);
    }

    let loaderConfig: LoaderConfig[];

    if (rendererConfig.loader === undefined) {
      loaderConfig = [];
    } else if (Array.isArray(rendererConfig.loader)) {
      loaderConfig = rendererConfig.loader.map(this.parseLoaderConfig);
    } else {
      loaderConfig = [this.parseLoaderConfig(rendererConfig.loader)];
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

    let pluginsEntryPoint: string | undefined = undefined;

    if (rendererConfig.plugins !== undefined) {
      if (typeof rendererConfig.plugins !== 'string') throw new Error('Plugins entry point must be a string');
      pluginsEntryPoint = rendererConfig.plugins;
    }

    return new RendererConfig(
      htmlEntryPoint,
      entryPoint,
      outputConfig,
      loaderConfig,
      exclude,
      devPort,
      pluginsEntryPoint,
    );
  }

  parseResourceConfig(resourceConfig: any): ResourceConfig {
    if (typeof resourceConfig.from !== 'string') throw new Error('Resource from must be a string');

    if (resourceConfig.to === undefined) throw new Error('Resource to is required');

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
      outputConfig = defaultOutputConfig;
    } else {
      outputConfig = this.parseOutputConfig(preloadConfig.output);
    }

    if (typeof preloadConfig.reload !== 'boolean') throw new Error('Preload reload must be a boolean');

    const reloadMainProcess: boolean = preloadConfig.reload;

    let loaderConfig: LoaderConfig[];

    if (preloadConfig.loader === undefined) {
      loaderConfig = [];
    } else if (Array.isArray(preloadConfig.loader)) {
      loaderConfig = preloadConfig.loader.map(this.parseLoaderConfig);
    } else {
      loaderConfig = [this.parseLoaderConfig(preloadConfig.loader)];
    }

    let exclude: string[];

    if (preloadConfig.exclude === undefined) {
      exclude = [];
    } else if (Array.isArray(preloadConfig.exclude)) {
      exclude = preloadConfig.exclude;
    } else {
      throw new Error('Preload exclude must be an array');
    }

    let pluginsEntryPoint: string | undefined = undefined;

    if (preloadConfig.plugins !== undefined) {
      if (typeof preloadConfig.plugins !== 'string') throw new Error('Preload plugins entry point must be a string');
      pluginsEntryPoint = preloadConfig.plugins;
    }

    return new PreloadConfig(entryPoint, outputConfig, reloadMainProcess, loaderConfig, exclude, pluginsEntryPoint);
  }
}
