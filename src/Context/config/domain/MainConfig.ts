import { PreloadConfig } from './PreloadConfig';
import { OutputConfig } from './OutputConfig';
import { LoaderConfig } from './LoaderConfig';
import path from 'path';

export class MainConfig {
  readonly entry: string;
  readonly preloads?: ReadonlyArray<PreloadConfig>;
  readonly loaders?: ReadonlyArray<LoaderConfig>;
  readonly output?: OutputConfig;

  constructor(entry: string, preloads?: PreloadConfig[], loaders?: LoaderConfig[], output?: OutputConfig) {
    this.entry = entry;
    this.preloads = preloads;
    this.loaders = loaders;
    this.output = output;
  }

  static fromJson(json: any): MainConfig {
    const entry = json.entry;
    if (typeof entry !== 'string') {
      throw new Error('MainConfig.fromJson: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('MainConfig.fromJson: entry must be a relative path');
    }

    const preloads = MainConfig.preparePreloadsFromJson(json.preloads);
    const loaders = MainConfig.prepareLoadersFromJson(json.loaders);
    const output = json.output ? OutputConfig.fromJson(json.output) : undefined;

    return new MainConfig(entry, preloads, loaders, output);
  }

  private static preparePreloadsFromJson(preloads: any): PreloadConfig[] | undefined {
    if (preloads === undefined) {
      return undefined;
    }

    if (!Array.isArray(preloads)) {
      preloads = [preloads];
    }

    return preloads.map(PreloadConfig.fromJson);
  }

  private static prepareLoadersFromJson(loaders: any): LoaderConfig[] | undefined {
    if (loaders === undefined) {
      return undefined;
    }

    if (!Array.isArray(loaders)) {
      loaders = [loaders];
    }

    return loaders.map(LoaderConfig.fromJson);
  }
}
