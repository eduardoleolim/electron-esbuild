import { MainConfig } from './MainConfig.mjs';
import { RendererConfig } from './RendererConfig.mjs';
import { ResourceConfig } from './ResourceConfig.mjs';

export class ElectronConfig {
  readonly output: string;
  readonly mainConfig: MainConfig;
  readonly rendererConfigs: ReadonlyArray<RendererConfig>;
  readonly resourceConfigs: ResourceConfig[];

  constructor(
    output: string,
    mainConfig: MainConfig,
    rendererConfigs: RendererConfig[],
    resourceConfigs: ResourceConfig[],
  ) {
    this.output = output;
    this.mainConfig = mainConfig;
    this.rendererConfigs = rendererConfigs;
    this.resourceConfigs = resourceConfigs;
  }
}
