import { BaseConfig } from './BaseConfig';
import { LoaderConfig } from './LoaderConfig';
import { OutputConfig } from './OutputConfig';

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
