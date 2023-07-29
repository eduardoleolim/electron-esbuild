import path from 'path';

import { BaseConfig } from './BaseConfig.js';
import { LoaderConfig } from './LoaderConfig.js';
import { OutputConfig } from './OutputConfig.js';
import { PreloadConfig } from './PreloadConfig.js';

export class MainConfig extends BaseConfig {
  readonly preloads: ReadonlyArray<PreloadConfig>;
  readonly output: OutputConfig;

  constructor(
    entry: string,
    output: OutputConfig,
    preloads: PreloadConfig[],
    loaders: LoaderConfig[],
    exclude: string[],
    pluginsEntry?: string,
  ) {
    super(entry, loaders, exclude, pluginsEntry);
    this.preloads = preloads;
    this.output = output;
  }

  static fromObject(object: any): MainConfig {
    if (object === undefined) {
      throw new Error('MainConfig.fromObject: config is required');
    }

    const entry = object.entry;
    const pluginsEntry = object.plugins;

    if (typeof entry !== 'string') {
      throw new Error('MainConfig.fromObject: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('MainConfig.fromObject: entry must be a relative path');
    }

    if (pluginsEntry !== undefined) {
      if (typeof pluginsEntry !== 'string') throw new Error('MainConfig.fromObject: pluginsEntry must be a string');

      if (path.isAbsolute(pluginsEntry)) throw new Error('MainConfig.fromObject: pluginsEntry must be a relative path');
    }

    if (object.output === undefined) {
      throw new Error('MainConfig.fromObject: output is required');
    }

    const output = OutputConfig.fromObject(object.output);
    const preloads = MainConfig.preparePreloadsFromObject(object.preloads);
    const loaders = MainConfig.prepareLoadersFromObject(object.loaders);
    const excludes = MainConfig.prepareExcludesFromObject(object.exclude);

    return new MainConfig(entry, output, preloads, loaders, excludes, pluginsEntry);
  }

  private static preparePreloadsFromObject(preloads: any): PreloadConfig[] {
    if (preloads === undefined) {
      return [];
    }

    if (!Array.isArray(preloads)) {
      preloads = [preloads];
    }

    return preloads.map(PreloadConfig.fromObject);
  }
}
