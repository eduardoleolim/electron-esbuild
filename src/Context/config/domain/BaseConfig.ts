import { LoaderConfig } from './LoaderConfig';
import { OutputConfig } from './OutputConfig';

export abstract class BaseConfig {
  readonly entryPoint: string;
  readonly output: OutputConfig;
  readonly pluginsEntryPoint?: string;
  readonly loaderConfigs: ReadonlyArray<LoaderConfig>;
  readonly excludedLibraries: ReadonlyArray<string>;

  protected constructor(
    entryPoint: string,
    output: OutputConfig,
    loaderConfigs: LoaderConfig[],
    excludedLibraries: string[],
    pluginsEntryPoint?: string,
  ) {
    this.entryPoint = entryPoint;
    this.output = output;
    this.pluginsEntryPoint = pluginsEntryPoint;
    this.excludedLibraries = excludedLibraries;
    this.loaderConfigs = loaderConfigs;
  }
}
