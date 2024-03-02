import { BaseConfig } from './BaseConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';
import { PreloadConfig } from './PreloadConfig.mjs';

export class MainConfig extends BaseConfig {
  readonly preloadConfigs: ReadonlyArray<PreloadConfig>;

  constructor(
    entryPoint: string,
    output: OutputConfig,
    preloadConfigs: PreloadConfig[],
    loaders: LoaderConfig[],
    exclude: string[],
    baseConfigEntryPoint?: string,
  ) {
    super(entryPoint, output, loaders, exclude, baseConfigEntryPoint);
    this.preloadConfigs = preloadConfigs;
  }
}
