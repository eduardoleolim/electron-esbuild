import { ElectronConfig } from './ElectronConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { MainConfig } from './MainConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';
import { PreloadConfig } from './PreloadConfig.mjs';
import { RendererConfig } from './RendererConfig.mjs';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from './ResourceConfig.mjs';

export abstract class ConfigParser {
  /**
   * Parse a file and return the parsed object
   * @param {string} sourcePath - The path to the file to parse
   * @throws {Error} - If the source is not valid
   * @returns {ElectronConfig[]} - The parsed object
   */
  abstract parse(sourcePath: string): ElectronConfig[];

  /**
   * Parse the electron config object
   * @param {any} config - The electron config object
   * @throws {Error} - If the config is not valid
   * @returns {ElectronConfig} - The parsed electron config object
   */
  protected parseElectronConfig(config: any): ElectronConfig {
    let output = './dist';
    const preloadConfigs: PreloadConfig[] = [];
    const rendererConfigs: RendererConfig[] = [];
    const resourceConfigs: ResourceConfig[] = [];

    if (typeof config.output === 'string') {
      output = config.output;
    }

    if (config.main == undefined) {
      throw new Error('Main config is required');
    }

    if (config.renderers == undefined) {
      throw new Error('Renderer config is required');
    }

    const mainConfig: MainConfig = this.parseMainConfig(config.main);

    if (config.preloads !== undefined) {
      if (Array.isArray(config.preloads)) {
        config.preloads.map((config: any) => {
          preloadConfigs.push(this.parsePreloadConfig(config, mainConfig.output));
        });
      } else {
        preloadConfigs.push(this.parsePreloadConfig(config.preloads, mainConfig.output));
      }
    }

    if (Array.isArray(config.renderers)) {
      config.renderers.map((config: any) => {
        rendererConfigs.push(this.parseRendererConfig(config, mainConfig.output));
      });
    } else {
      rendererConfigs.push(this.parseRendererConfig(config.renderers, mainConfig.output));
    }

    if (config.resources !== undefined) {
      if (Array.isArray(config.resources)) {
        config.resources.map((config: any) => {
          resourceConfigs.push(this.parseResourceConfig(config, mainConfig.output.directory));
        });
      } else {
        resourceConfigs.push(this.parseResourceConfig(config.resources, mainConfig.output.directory));
      }
    }

    return new ElectronConfig(output, mainConfig, preloadConfigs, rendererConfigs, resourceConfigs);
  }

  /**
   * Parses the main config object from the object
   * @param {any} config - Main config object
   * @throws {Error} - If the config is not valid
   * @returns {MainConfig} - Main config object
   */
  protected parseMainConfig(config: any): MainConfig {
    const entryPoint = config.entry;
    let baseConfigEntryPoint: string | undefined = undefined;
    const loaderConfigs: LoaderConfig[] = [];
    const excludeConfigs: string[] = [];

    if (typeof config.entry !== 'string') {
      throw new Error('Main entry point must be a string');
    }

    if (config.output == undefined) {
      throw new Error('Main output is required');
    }

    const outputConfig: OutputConfig = this.parseOutputConfig(config.output);

    if (Array.isArray(config.loaders)) {
      config.loaders.map((config: any) => {
        loaderConfigs.push(this.parseLoaderConfig(config));
      });
    } else if (config.loaders != undefined) {
      throw new Error('Main loaders must be an array');
    }

    if (Array.isArray(config.exclude)) {
      config.exclude.map((exclude: any) => {
        if (typeof exclude !== 'string') {
          throw new Error('Excluded library must be a string');
        }

        excludeConfigs.push(exclude);
      });
    } else if (config.exclude != undefined) {
      throw new Error('Main exclude must be an array');
    }

    if (config.esbuild !== undefined) {
      if (typeof config.esbuild !== 'string') {
        throw new Error('Base config entry point must be a string');
      }

      baseConfigEntryPoint = config.esbuild;
    }

    return new MainConfig(entryPoint, outputConfig, loaderConfigs, excludeConfigs, baseConfigEntryPoint);
  }

  /**
   * Parses the renderer config object from the object
   * @param {any} config - Renderer config object
   * @param {OutputConfig} defaultOutputConfig - Default output config
   * @throws {Error} - If the config is not valid
   */
  protected parseRendererConfig(config: any, defaultOutputConfig: OutputConfig): RendererConfig {
    const htmlEntryPoint = config.html;
    const entryPoint = config.entry;
    const output = config.output;
    const devPort = config.devPort;
    let baseConfigEntryPoint: string | undefined = undefined;
    let outputConfig: OutputConfig;
    const loaderConfigs: LoaderConfig[] = [];
    const excludeConfigs: string[] = [];

    if (typeof htmlEntryPoint !== 'string') {
      throw new Error('Renderer HTML point is required');
    }

    if (typeof entryPoint !== 'string') {
      throw new Error('Renderer entry must be a string');
    }

    if (typeof devPort !== 'number') {
      throw new Error('Renderer dev port must be a number');
    }

    if (output == undefined) {
      throw new Error('Renderer output is required');
    } else {
      if (output.directory === undefined) {
        output.directory = defaultOutputConfig.directory;
      }

      outputConfig = this.parseOutputConfig(output);
    }

    if (Array.isArray(config.loaders)) {
      config.loaders.map((config: any) => {
        loaderConfigs.push(this.parseLoaderConfig(config));
      });
    } else if (config.loaders != undefined) {
      throw new Error('Main loaders must be an array');
    }

    if (Array.isArray(config.exclude)) {
      config.exclude.map((exclude: any) => {
        if (typeof exclude !== 'string') {
          throw new Error('Excluded library must be a string');
        }

        excludeConfigs.push(exclude);
      });
    } else if (config.exclude != undefined) {
      throw new Error('Main exclude must be an array');
    }

    if (config.esbuild !== undefined) {
      if (typeof config.esbuild !== 'string') {
        throw new Error('Base config entry point must be a string');
      }

      baseConfigEntryPoint = config.esbuild;
    }

    return new RendererConfig(
      htmlEntryPoint,
      entryPoint,
      outputConfig,
      loaderConfigs,
      excludeConfigs,
      devPort,
      baseConfigEntryPoint,
    );
  }

  protected parsePreloadConfig(config: any, defaultOutputConfig: OutputConfig): PreloadConfig {
    const entryPoint = config.entry;
    const output = config.output;
    let baseConfigEntryPoint: string | undefined = undefined;
    let outputConfig: OutputConfig;
    const rendererProcesses: number[] = [];
    const loaderConfigs: LoaderConfig[] = [];
    const excludeConfigs: string[] = [];

    if (typeof entryPoint !== 'string') {
      throw new Error('Preload entry must be a string');
    }

    if (output == undefined) {
      throw new Error('Preload output is required');
    } else {
      if (output.directory === undefined) {
        output.directory = defaultOutputConfig.directory;
      }

      outputConfig = this.parseOutputConfig(output);
    }

    if (Array.isArray(config.renderers)) {
      config.renderers.map((renderer: any) => {
        if (typeof renderer !== 'number') {
          throw new Error('Renderer process must be a number');
        }

        rendererProcesses.push(renderer);
      });
    } else if (config.renderers != undefined) {
      throw new Error('Renderer processes must be an array');
    }

    if (Array.isArray(config.loaders)) {
      config.loaders.map((config: any) => {
        loaderConfigs.push(this.parseLoaderConfig(config));
      });
    } else if (config.loaders != undefined) {
      throw new Error('Main loaders must be an array');
    }

    if (Array.isArray(config.exclude)) {
      config.exclude.map((exclude: any) => {
        if (typeof exclude !== 'string') {
          throw new Error('Excluded library must be a string');
        }

        excludeConfigs.push(exclude);
      });
    } else if (config.exclude != undefined) {
      throw new Error('Main exclude must be an array');
    }

    if (config.esbuild !== undefined) {
      if (typeof config.esbuild !== 'string') {
        throw new Error('Base config entry point must be a string');
      }

      baseConfigEntryPoint = config.esbuild;
    }

    return new PreloadConfig(
      entryPoint,
      outputConfig,
      rendererProcesses,
      loaderConfigs,
      excludeConfigs,
      baseConfigEntryPoint,
    );
  }

  protected parseResourceConfig(config: any, defaultOutputDirectory: string): ResourceConfig {
    if (typeof config === 'string') {
      return new SimpleResourceConfig(config, defaultOutputDirectory);
    }

    if (typeof config.from !== 'string') {
      throw new Error('Resource from must be a string');
    }

    if (config.to === undefined) {
      return new SimpleResourceConfig(config.from, defaultOutputDirectory);
    }
    if (typeof config.to === 'string') {
      return new SimpleResourceConfig(config.from, config.to);
    }

    const outputConfig: OutputConfig = this.parseOutputConfig(config.to);
    return new CustomResourceConfig(config.from, outputConfig);
  }

  parseLoaderConfig(loaderConfig: any): LoaderConfig {
    if (typeof loaderConfig.extension !== 'string') {
      throw new Error('Loader extension must be a string');
    }

    if (typeof loaderConfig.loader !== 'string') {
      throw new Error('Loader loader must be a string');
    }

    return new LoaderConfig(loaderConfig.extension, loaderConfig.loader);
  }

  protected parseOutputConfig(outputConfig: any): OutputConfig {
    if (typeof outputConfig.directory !== 'string') {
      throw new Error('Output directory must be a string');
    }

    if (typeof outputConfig.filename !== 'string') {
      throw new Error('Output file name must be a string');
    }

    return new OutputConfig(outputConfig.directory, outputConfig.filename);
  }
}
