import { BaseConfig } from './BaseConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';

export class MainConfig extends BaseConfig {
  readonly args: string[];

  constructor(
    entryPoint: string,
    args: string[],
    output: OutputConfig,
    loaders: LoaderConfig[],
    exclude: string[],
    baseConfigEntryPoint?: string
  ) {
    super(entryPoint, output, loaders, exclude, baseConfigEntryPoint);
    this.args = args;
  }
}
