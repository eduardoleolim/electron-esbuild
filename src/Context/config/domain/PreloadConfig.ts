import path from 'path';

import { BaseConfig } from './BaseConfig.js';
import { LoaderConfig } from './LoaderConfig';
import { OutputConfig } from './OutputConfig.js';

export class PreloadConfig extends BaseConfig {
  readonly output?: OutputConfig;
  readonly reload: boolean;

  constructor(
    entry: string,
    reload: boolean,
    loaders: LoaderConfig[],
    exclude: string[],
    output?: OutputConfig,
    pluginsEntry?: string,
  ) {
    super(entry, loaders, exclude, pluginsEntry);
    this.output = output;
    this.reload = reload;
  }

  static fromObject(object: any): PreloadConfig {
    if (object === undefined) {
      throw new Error('PreloadConfig.fromObject: config is required');
    }

    const entry = object.entry;
    const pluginsEntry = object.plugins;
    let reload = object.reload;

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

    if (reload) {
      if (typeof reload !== 'boolean') throw new Error('PreloadConfig.fromObject: reload must be a boolean');
    } else {
      reload = false;
    }

    const output = object.output ? OutputConfig.fromObject(object.output) : undefined;
    const loaders = PreloadConfig.prepareLoadersFromObject(object.loaders);
    const excludes = PreloadConfig.prepareExcludesFromObject(object.exclude);

    return new PreloadConfig(entry, reload, loaders, excludes, output, pluginsEntry);
  }
}
