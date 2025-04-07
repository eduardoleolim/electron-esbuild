import { ConfigReader } from './ConfigReader.mjs';
import { ElectronConfig } from './ElectronConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { MainConfig } from './MainConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';
import { PreloadConfig } from './PreloadConfig.mjs';
import { RendererConfig } from './RendererConfig.mjs';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from './ResourceConfig.mjs';

interface UnparsedOutputConfig {
  directory?: string;
  filename?: string;
}

interface UnparsedLoaderConfig {
  loader?: string;
  extension?: string;
}

interface UnparsedResoruceConfig {
  from?: string;
  to?: string | object;
}

interface UnparsedPreloadConfig {
  entry: string;
  output: unknown;
  renderers: number[];
  loaders: unknown[];
  exclude: string[];
  base: string;
}

interface UnparsedRendererConfig {
  html?: string;
  entry?: string;
  devPort: number;
  output: unknown;
  loaders?: unknown[];
  exclude?: string[];
  base?: string;
}

interface UnparsedMainConfig {
  entry: string;
  args?: string[];
  output: unknown;
  loaders?: unknown[];
  exclude?: string[];
  base?: string;
}

interface UnparsedElectronConfig {
  output?: string;
  main: unknown;
  renderers: unknown | unknown[];
  preloads?: unknown | unknown[];
  resources?: unknown | unknown[];
}

export enum RendererBuilderType {
  VITE = 'vite',
  ASTRO = 'astro',
  ESBUILD = 'esbuild'
}

export class ConfigParser {
  /**
   * Parse a file and return the parsed object
   * @param {ConfigReader} reader - The reader to use
   * @param {RendererBuilderType} rendererBuilderType - Indicates what renderer builder type will be used
   * @throws {Error} - If the source is not valid
   * @returns {ElectronConfig[]} - The parsed object
   */
  public parse(reader: ConfigReader, rendererBuilderType: RendererBuilderType): ElectronConfig[] {
    const config = reader.read();

    if (!config) throw new Error('Invalid config file');

    if (!Array.isArray(config)) {
      return [this.parseElectronConfig(config, rendererBuilderType)];
    } else {
      return config.map((config) => this.parseElectronConfig(config, rendererBuilderType));
    }
  }

  /**
   * Parse the electron config object
   * @param {unknown} config - The electron config object
   * @param {RendererBuilderType} rendererBuilderType - Indicates what renderer builder type will be used
   * @throws {Error} - If the config is not valid
   * @returns {ElectronConfig} - The parsed electron config object
   */
  public parseElectronConfig(config: unknown, rendererBuilderType: RendererBuilderType): ElectronConfig {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Config is required');
    }

    const electronConfig = config as UnparsedElectronConfig;

    const output = typeof electronConfig.output === 'string' ? electronConfig.output : './dist';

    if (!('main' in electronConfig)) {
      throw new Error('Main config is required');
    }

    if (!('renderers' in electronConfig)) {
      throw new Error('Renderer config is required');
    }

    const mainConfig = this.parseMainConfig(electronConfig.main);

    const preloadConfigs = Array.isArray(electronConfig.preloads)
      ? electronConfig.preloads.map((config) => this.parsePreloadConfig(config, mainConfig.output))
      : electronConfig.preloads
        ? [this.parsePreloadConfig(electronConfig.preloads, mainConfig.output)]
        : [];

    const rendererConfigs = Array.isArray(electronConfig.renderers)
      ? electronConfig.renderers.map((config) =>
          this.parseRendererConfig(config, mainConfig.output, rendererBuilderType)
        )
      : [this.parseRendererConfig(electronConfig.renderers, mainConfig.output, rendererBuilderType)];

    const resourceConfigs = Array.isArray(electronConfig.resources)
      ? electronConfig.resources.map((config) => this.parseResourceConfig(config, mainConfig.output.directory))
      : electronConfig.resources
        ? [this.parseResourceConfig(electronConfig.resources, mainConfig.output.directory)]
        : [];

    return new ElectronConfig(output, mainConfig, preloadConfigs, rendererConfigs, resourceConfigs);
  }

  /**
   * Parses the main config object from the object
   * @param {unknown} config - Main config object
   * @throws {Error} - If the config is not valid
   * @returns {MainConfig} - Main config object
   */
  public parseMainConfig(config: unknown): MainConfig {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Main config is required');
    }

    const mainConfig = config as UnparsedMainConfig;

    if (typeof mainConfig.entry !== 'string') {
      throw new Error('Main entry point must be a string');
    }

    const args =
      Array.isArray(mainConfig.args) && mainConfig.args.every((arg) => typeof arg === 'string') ? mainConfig.args : [];

    const outputConfig = this.parseOutputConfig(mainConfig.output);

    const loaderConfigs = Array.isArray(mainConfig.loaders)
      ? mainConfig.loaders.map((loader) => this.parseLoaderConfig(loader))
      : [];

    const excludeConfigs =
      Array.isArray(mainConfig.exclude) && mainConfig.exclude.every((exclude) => typeof exclude === 'string')
        ? mainConfig.exclude
        : [];

    const baseConfigEntryPoint = typeof mainConfig.base === 'string' ? mainConfig.base : undefined;

    return new MainConfig(mainConfig.entry, args, outputConfig, loaderConfigs, excludeConfigs, baseConfigEntryPoint);
  }

  /**
   * Parses the renderer config object from the object
   * @param {unknown} config - Renderer config object
   * @param {OutputConfig} defaultOutputConfig - Default output config
   * @param {RendererBuilderType} rendererBuilderType - Indicates what renderer builder type will be used
   * @throws {Error} - If the config is not valid
   */
  public parseRendererConfig(
    config: unknown,
    defaultOutputConfig: OutputConfig,
    rendererBuilderType: RendererBuilderType
  ): RendererConfig {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Renderer config is required');
    }

    const rendererConfig = config as UnparsedRendererConfig;
    let entryPoint = rendererConfig.entry;
    let entryHtml = rendererConfig.html;

    if (rendererBuilderType === RendererBuilderType.VITE) {
      entryPoint = rendererConfig.html;
    }

    if (rendererBuilderType === RendererBuilderType.ASTRO) {
      entryHtml = entryPoint;
    }

    if (typeof entryPoint !== 'string') {
      throw new Error('Renderer entry point must be a string');
    }

    if (typeof entryHtml !== 'string') {
      throw new Error('Renderer entry html must be a string');
    }

    if (typeof rendererConfig.devPort !== 'number') {
      throw new Error('Renderer dev port must be a number');
    }

    const outputConfig = this.parseOutputConfig(rendererConfig.output || { directory: defaultOutputConfig.directory });

    const loaderConfigs = Array.isArray(rendererConfig.loaders)
      ? rendererConfig.loaders.map((loader) => this.parseLoaderConfig(loader))
      : [];

    const excludeConfigs = Array.isArray(rendererConfig.exclude)
      ? rendererConfig.exclude.every((exclude) => typeof exclude === 'string')
        ? rendererConfig.exclude
        : []
      : [];

    const baseConfigEntryPoint = typeof rendererConfig.base === 'string' ? rendererConfig.base : undefined;

    return new RendererConfig(
      entryHtml,
      entryPoint,
      outputConfig,
      loaderConfigs,
      excludeConfigs,
      rendererConfig.devPort,
      baseConfigEntryPoint
    );
  }

  public parsePreloadConfig(preloadConfig: unknown, defaultOutputConfig: OutputConfig): PreloadConfig {
    if (typeof preloadConfig !== 'object' || preloadConfig === null) {
      throw new Error('Preload config is required');
    }

    const config = preloadConfig as UnparsedPreloadConfig;

    if (typeof config.entry !== 'string') {
      throw new Error('Preload entry must be a string');
    }

    const outputConfig = this.parseOutputConfig(config.output || { directory: defaultOutputConfig.directory });

    const rendererProcesses =
      Array.isArray(config.renderers) && config.renderers.every((renderer) => typeof renderer === 'number')
        ? config.renderers
        : [];

    const loaderConfigs = Array.isArray(config.loaders)
      ? config.loaders.map((loader) => this.parseLoaderConfig(loader))
      : [];

    const excludeConfigs =
      Array.isArray(config.exclude) && config.exclude.every((exclude) => typeof exclude === 'string')
        ? config.exclude
        : [];

    const baseConfigEntryPoint = typeof config.base === 'string' ? config.base : undefined;

    return new PreloadConfig(
      config.entry,
      outputConfig,
      rendererProcesses,
      loaderConfigs,
      excludeConfigs,
      baseConfigEntryPoint
    );
  }

  public parseResourceConfig(resourceConfig: unknown, defaultOutputDirectory: string): ResourceConfig {
    if (typeof resourceConfig === 'string') {
      return new SimpleResourceConfig(resourceConfig, defaultOutputDirectory);
    }

    if (typeof resourceConfig !== 'object' || resourceConfig === null) {
      throw new Error('Resource config is required');
    }

    const config = resourceConfig as UnparsedResoruceConfig;

    if (typeof config.from !== 'string') {
      throw new Error('Resource from is required and must be a string');
    }

    if (config.to === undefined || typeof config.to === 'string') {
      return new SimpleResourceConfig(config.from, config.to || defaultOutputDirectory);
    }

    const outputConfig = this.parseOutputConfig(config.to);
    return new CustomResourceConfig(config.from, outputConfig);
  }

  parseLoaderConfig(loaderConfig: unknown): LoaderConfig {
    if (typeof loaderConfig !== 'object' || loaderConfig === null) {
      throw new Error('Loader config is required');
    }

    const config = loaderConfig as UnparsedLoaderConfig;

    if (typeof config.extension !== 'string') {
      throw new Error('Loader extension must be a string');
    }

    if (typeof config.loader !== 'string') {
      throw new Error('Loader loader must be a string');
    }

    return new LoaderConfig(config.extension, config.loader);
  }

  public parseOutputConfig(outputConfig: unknown): OutputConfig {
    if (typeof outputConfig !== 'object' || outputConfig === null) {
      throw new Error('Output config is required');
    }

    const config = outputConfig as UnparsedOutputConfig;

    if (typeof config.directory !== 'string') {
      throw new Error('Output directory must be a string');
    }

    if (typeof config.filename !== 'string') {
      throw new Error('Output file name must be a string');
    }

    return new OutputConfig(config.directory, config.filename);
  }
}
