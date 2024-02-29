import path from 'path';

import { BaseConfig } from './BaseConfig';
import { LoaderConfig } from './LoaderConfig';
import { OutputConfig } from './OutputConfig';

export class PreloadConfig extends BaseConfig {
  readonly reloadMainProcess: boolean;

  constructor(
    entryPoint: string,
    output: OutputConfig,
    reloadMainProcess: boolean,
    loaderConfigs: LoaderConfig[],
    excludedLibraries: string[],
    pluginsEntry?: string,
  ) {
    super(entryPoint, output, loaderConfigs, excludedLibraries, pluginsEntry);
    this.reloadMainProcess = reloadMainProcess;
  }
}
