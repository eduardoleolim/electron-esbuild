import { OutputConfig } from './OutputConfig.js';
import path from 'path';

export class PreloadConfig {
  readonly entry: string;
  readonly output?: OutputConfig;

  constructor(entry: string, output?: OutputConfig) {
    this.entry = entry;
    this.output = output;
  }

  static fromObject(object: any): PreloadConfig {
    const entry = object.entry;
    if (typeof entry !== 'string') {
      throw new Error('PreloadConfig.fromObject: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('PreloadConfig.fromObject: entry must be a relative path');
    }

    const output = object.output ? OutputConfig.fromObject(object.output) : undefined;

    return new PreloadConfig(entry, output);
  }
}
