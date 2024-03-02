import { BaseConfig } from './BaseConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';

export class PreloadConfig extends BaseConfig {
  readonly reloadMainProcess: boolean;

  constructor(
    entryPoint: string,
    output: OutputConfig,
    reloadMainProcess: boolean,
    loaderConfigs: LoaderConfig[],
    excludedLibraries: string[],
    baseConfigEntryPoint?: string,
  ) {
    super(entryPoint, output, loaderConfigs, excludedLibraries, baseConfigEntryPoint);
    this.reloadMainProcess = reloadMainProcess;
  }
}
