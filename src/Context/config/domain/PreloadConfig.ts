import { OutputConfig } from './OutputConfig';
import path from 'path';

export class PreloadConfig {
  readonly entry: string;
  readonly output?: OutputConfig;

  constructor(entry: string, output?: OutputConfig) {
    this.entry = entry;
    this.output = output;
  }

  static fromJson(json: any): PreloadConfig {
    const entry = json.entry;
    if (typeof entry !== 'string') {
      throw new Error('PreloadConfig.fromJson: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('PreloadConfig.fromJson: entry must be a relative path');
    }

    const output = json.output ? OutputConfig.fromJson(json.output) : undefined;

    return new PreloadConfig(entry, output);
  }
}
