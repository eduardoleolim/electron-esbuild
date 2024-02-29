import { BaseConfig } from './BaseConfig';
import { LoaderConfig } from './LoaderConfig';
import { OutputConfig } from './OutputConfig';
import { PreloadConfig } from './PreloadConfig';

export class MainConfig extends BaseConfig {
  readonly preloadConfigs: ReadonlyArray<PreloadConfig>;

  constructor(
    entryPoint: string,
    output: OutputConfig,
    preloadConfigs: PreloadConfig[],
    loaders: LoaderConfig[],
    exclude: string[],
    pluginsEntry?: string,
  ) {
    super(entryPoint, output, loaders, exclude, pluginsEntry);
    this.preloadConfigs = preloadConfigs;
  }
}
