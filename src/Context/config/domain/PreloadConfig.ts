import path from 'path';

import { BaseConfig } from './BaseConfig.js';
import { OutputConfig } from './OutputConfig.js';

export class PreloadConfig extends BaseConfig {
  readonly entry: string;
  readonly output?: OutputConfig;

  constructor(entry: string, output?: OutputConfig, pluginsEntry?: string) {
    super(pluginsEntry);
    this.entry = entry;
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

    return new PreloadConfig(entry, output, pluginsEntry);
  }
}
