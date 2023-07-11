import { OutputConfig } from './OutputConfig';
import path from 'path';
import { LoaderConfig } from './LoaderConfig';

export class RendererConfig {
  readonly entry: string;
  readonly html: string;
  readonly devPort?: number;
  readonly loaders?: ReadonlyArray<LoaderConfig>;
  readonly exclude?: ReadonlyArray<string>;
  readonly output?: OutputConfig;

  constructor(
    entry: string,
    html: string,
    devPort?: number,
    loaders?: LoaderConfig[],
    exclude?: string[],
    output?: OutputConfig,
  ) {
    this.entry = entry;
    this.html = html;
    this.devPort = devPort;
    this.loaders = loaders;
    this.exclude = exclude;
    this.output = output;
  }

  static fromJson(json: any): RendererConfig {
    const entry = json.entry;
    const html = json.html;
    const devPort = json.devPort;

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

    if (devPort !== undefined && typeof devPort !== 'number') {
      throw new Error('RendererConfig.fromJson: devPort must be a number');
    }

    const output = json.output ? OutputConfig.fromJson(json.output) : undefined;
    const loaders = RendererConfig.prepareLoadersFromJson(json.loaders);
    const excludes = RendererConfig.prepareExcludesFromJson(json.exclude);

    return new RendererConfig(entry, html, devPort, loaders, excludes, output);
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

  private static prepareExcludesFromJson(excludes: any): string[] | undefined {
    if (excludes === undefined) {
      return undefined;
    }

    if (!Array.isArray(excludes)) {
      excludes = [excludes];
    }

    return excludes.map((exclude: any) => {
      if (typeof exclude !== 'string') {
        throw new Error(`RendererConfig.fromJson: <${exclude}> must be a string`);
      }

      return exclude;
    });
  }
}
