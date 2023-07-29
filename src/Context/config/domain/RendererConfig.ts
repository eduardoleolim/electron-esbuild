import path from 'path';

import { BaseConfig } from './BaseConfig.js';
import { LoaderConfig } from './LoaderConfig.js';
import { OutputConfig } from './OutputConfig.js';

export class RendererConfig extends BaseConfig {
  readonly html: string;
  readonly devPort?: number;
  readonly output?: OutputConfig;

  constructor(
    entry: string,
    html: string,
    loaders: LoaderConfig[],
    excludes: string[],
    devPort?: number,
    output?: OutputConfig,
    pluginsEntry?: string,
  ) {
    super(entry, loaders, excludes, pluginsEntry);
    this.html = html;
    this.devPort = devPort;
    this.output = output;
  }

  static fromObject(object: any): RendererConfig {
    if (object === undefined) {
      throw new Error('RendererConfig.fromObject: config is required');
    }

    const entry = object.entry;
    const html = object.html;
    const devPort = object.devPort;
    const pluginsEntry = object.plugins;

    if (typeof entry !== 'string') {
      throw new Error('RendererConfig.fromObject: entry must be a string');
    }

    if (path.isAbsolute(entry)) {
      throw new Error('RendererConfig.fromObject: entry must be a relative path');
    }

    if (typeof html !== 'string') {
      throw new Error('RendererConfig.fromObject: html must be a string');
    }

    if (path.isAbsolute(html)) {
      throw new Error('RendererConfig.fromObject: html must be a relative path');
    }

    if (devPort !== undefined && typeof devPort !== 'number') {
      throw new Error('RendererConfig.fromObject: devPort must be a number');
    }

    if (pluginsEntry !== undefined) {
      if (typeof pluginsEntry !== 'string') throw new Error('RendererConfig.fromObject: plugins must be a string');

      if (path.isAbsolute(pluginsEntry)) throw new Error('RendererConfig.fromObject: plugins must be a relative path');
    }

    const output = object.output ? OutputConfig.fromObject(object.output) : undefined;
    const loaders = RendererConfig.prepareLoadersFromObject(object.loaders);
    const excludes = RendererConfig.prepareExcludesFromObject(object.exclude);

    return new RendererConfig(entry, html, loaders, excludes, devPort, output, pluginsEntry);
  }
}
