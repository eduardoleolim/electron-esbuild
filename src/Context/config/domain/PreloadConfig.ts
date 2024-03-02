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
    baseConfigEntryPoint?: string,
  ) {
    super(entryPoint, output, loaderConfigs, excludedLibraries, baseConfigEntryPoint);
    this.reloadMainProcess = reloadMainProcess;
  }
}
