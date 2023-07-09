import { OutputConfig } from './OutputConfig';
import path from 'path';
import { LoaderConfig } from './LoaderConfig';

export class RendererConfig {
  readonly entry: string;
  readonly html: string;
  readonly loaders?: ReadonlyArray<LoaderConfig>;
  readonly output?: OutputConfig;

  constructor(entry: string, html: string, loaders?: LoaderConfig[], output?: OutputConfig) {
    this.entry = entry;
    this.html = html;
    this.loaders = loaders;
    this.output = output;
  }

  static fromJson(json: any): RendererConfig {
    const entry = json.entry;
    const html = json.html;
    if (typeof entry !== 'string') {
      throw new Error('RendererConfig.fromJson: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('RendererConfig.fromJson: entry must be a relative path');
    }

    if (typeof html !== 'string') {
      throw new Error('RendererConfig.fromJson: html must be a string');
    }

    if (path.isAbsolute(html)) {
      throw new Error('RendererConfig.fromJson: html must be a relative path');
    }

    const output = json.output ? OutputConfig.fromJson(json.output) : undefined;
    const loaders = RendererConfig.prepareLoadersFromJson(json.loaders);

    return new RendererConfig(entry, html, loaders, output);
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
