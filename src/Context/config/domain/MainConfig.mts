import { BaseConfig } from './BaseConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';
import { PreloadConfig } from './PreloadConfig.mjs';

export class MainConfig extends BaseConfig {
  constructor(
    entryPoint: string,
    output: OutputConfig,
    loaders: LoaderConfig[],
    exclude: string[],
    baseConfigEntryPoint?: string,
  ) {
    super(entryPoint, output, loaders, exclude, baseConfigEntryPoint);
  }
}
