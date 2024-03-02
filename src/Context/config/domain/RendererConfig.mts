import { BaseConfig } from './BaseConfig.mjs';
import { LoaderConfig } from './LoaderConfig.mjs';
import { OutputConfig } from './OutputConfig.mjs';

export class RendererConfig extends BaseConfig {
  readonly htmlEntryPoint: string;
  readonly devPort: number;

  constructor(
    htmlEntryPoint: string,
    entryPoint: string,
    output: OutputConfig,
    loaderConfigs: LoaderConfig[],
    excludedLibraries: string[],
    devPort: number,
    baseConfigEntryPoint?: string,
  ) {
    super(entryPoint, output, loaderConfigs, excludedLibraries, baseConfigEntryPoint);
    this.htmlEntryPoint = htmlEntryPoint;
    this.devPort = devPort;
  }
}
