import { LoaderConfig } from './LoaderConfig';
import { OutputConfig } from './OutputConfig';

export abstract class BaseConfig {
  readonly entryPoint: string;
  readonly output: OutputConfig;
  readonly baseConfigEntryPoint?: string;
  readonly loaderConfigs: ReadonlyArray<LoaderConfig>;
  readonly excludedLibraries: ReadonlyArray<string>;

  protected constructor(
    entryPoint: string,
    output: OutputConfig,
    loaderConfigs: LoaderConfig[],
    excludedLibraries: string[],
    baseConfigEntryPoint?: string,
  ) {
    this.entryPoint = entryPoint;
    this.output = output;
    this.baseConfigEntryPoint = baseConfigEntryPoint;
    this.excludedLibraries = excludedLibraries;
    this.loaderConfigs = loaderConfigs;
  }
}
