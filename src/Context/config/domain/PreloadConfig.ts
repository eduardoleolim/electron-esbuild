import path from 'path';

import { BaseConfig } from './BaseConfig.js';
import { LoaderConfig } from './LoaderConfig';
import { OutputConfig } from './OutputConfig.js';

export class PreloadConfig extends BaseConfig {
  readonly output?: OutputConfig;

  constructor(entry: string, loaders: LoaderConfig[], exclude: string[], output?: OutputConfig, pluginsEntry?: string) {
    super(entry, loaders, exclude, pluginsEntry);
    this.output = output;
  }

  static fromObject(object: any): PreloadConfig {
    if (object === undefined) {
      throw new Error('PreloadConfig.fromObject: config is required');
    }

    const entry = object.entry;
    const pluginsEntry = object.plugins;

    if (typeof entry !== 'string') {
      throw new Error('PreloadConfig.fromObject: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('PreloadConfig.fromObject: entry must be a relative path');
    }

    if (pluginsEntry !== undefined) {
      if (typeof pluginsEntry !== 'string') throw new Error('PreloadConfig.fromObject: pluginsEntry must be a string');

      if (path.isAbsolute(pluginsEntry))
        throw new Error('PreloadConfig.fromObject: pluginsEntry must be a relative path');
    }

    const output = object.output ? OutputConfig.fromObject(object.output) : undefined;
    const loaders = PreloadConfig.prepareLoadersFromObject(object.loaders);
    const excludes = PreloadConfig.prepareExcludesFromObject(object.exclude);

    return new PreloadConfig(entry, loaders, excludes, output, pluginsEntry);
  }
}
