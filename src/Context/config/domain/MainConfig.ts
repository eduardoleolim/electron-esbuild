import { PreloadConfig } from './PreloadConfig.js';
import { OutputConfig } from './OutputConfig.js';
import { LoaderConfig } from './LoaderConfig.js';
import path from 'path';

export class MainConfig {
  readonly entry: string;
  readonly preloads?: ReadonlyArray<PreloadConfig>;
  readonly loaders?: ReadonlyArray<LoaderConfig>;
  readonly exclude?: ReadonlyArray<string>;
  readonly output: OutputConfig;

  constructor(
    entry: string,
    output: OutputConfig,
    preloads?: PreloadConfig[],
    loaders?: LoaderConfig[],
    exclude?: string[],
  ) {
    this.entry = entry;
    this.preloads = preloads;
    this.loaders = loaders;
    this.exclude = exclude;
    this.output = output;
  }

  static fromObject(object: any): MainConfig {
    if (object === undefined) {
      throw new Error('MainConfig.fromObject: config is required');
    }

    const entry = object.entry;
    if (typeof entry !== 'string') {
      throw new Error('MainConfig.fromObject: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('MainConfig.fromObject: entry must be a relative path');
    }

    if (object.output === undefined) {
      throw new Error('MainConfig.fromObject: output is required');
    }
    const output = OutputConfig.fromObject(object.output);
    const preloads = MainConfig.preparePreloadsFromObject(object.preloads);
    const loaders = MainConfig.prepareLoadersFromObject(object.loaders);
    const excludes = MainConfig.prepareExcludesFroObject(object.exclude);

    return new MainConfig(entry, output, preloads, loaders, excludes);
  }

  private static preparePreloadsFromObject(preloads: any): PreloadConfig[] | undefined {
    if (preloads === undefined) {
      return undefined;
    }

    if (!Array.isArray(preloads)) {
      preloads = [preloads];
    }

    return preloads.map(PreloadConfig.fromObject);
  }

  private static prepareLoadersFromObject(loaders: any): LoaderConfig[] | undefined {
    if (loaders === undefined) {
      return undefined;
    }

    if (!Array.isArray(loaders)) {
      loaders = [loaders];
    }

    return loaders.map(LoaderConfig.fromObject);
  }

  private static prepareExcludesFroObject(excludes: any): string[] | undefined {
    if (excludes === undefined) {
      return undefined;
    }

    if (!Array.isArray(excludes)) {
      excludes = [excludes];
    }

    return excludes.map((exclude: any) => {
      if (typeof exclude !== 'string') {
        throw new Error(`MainConfig.fromObject: <${exclude}> must be a string`);
      }

      return exclude;
    });
  }
}
