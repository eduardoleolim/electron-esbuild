import { BaseConfig } from './BaseConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';

export class PreloadConfig extends BaseConfig {
  readonly rendererProcesses: number[];

  constructor(
    entryPoint: string,
    output: OutputConfig,
    rendererProcesses: number[],
    loaderConfigs: LoaderConfig[],
    excludedLibraries: string[],
    baseConfigEntryPoint?: string,
  ) {
    super(entryPoint, output, loaderConfigs, excludedLibraries, baseConfigEntryPoint);
    this.rendererProcesses = rendererProcesses;
  }
}
