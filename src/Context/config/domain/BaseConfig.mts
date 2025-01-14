import { LoaderConfig } from './LoaderConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';

export abstract class BaseConfig {
  readonly entryPoint: string;
  readonly output: OutputConfig;
  readonly baseConfigEntryPoint?: string;
  readonly loaderConfigs: readonly LoaderConfig[];
  readonly excludedLibraries: readonly string[];

  protected constructor(
    entryPoint: string,
    output: OutputConfig,
    loaderConfigs: LoaderConfig[],
    excludedLibraries: string[],
    baseConfigEntryPoint?: string
  ) {
    this.entryPoint = entryPoint;
    this.output = output;
    this.baseConfigEntryPoint = baseConfigEntryPoint;
    this.excludedLibraries = excludedLibraries;
    this.loaderConfigs = loaderConfigs;
  }
}
