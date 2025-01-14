import { MainConfig } from './MainConfig.mjs';
import { PreloadConfig } from './PreloadConfig.mjs';
import { RendererConfig } from './RendererConfig.mjs';
import { ResourceConfig } from './ResourceConfig.mjs';

export class ElectronConfig {
  readonly output: string;
  readonly mainConfig: MainConfig;
  readonly preloadConfigs: readonly PreloadConfig[];
  readonly rendererConfigs: readonly RendererConfig[];
  readonly resourceConfigs: ResourceConfig[];

  constructor(
    output: string,
    mainConfig: MainConfig,
    preloadConfigs: PreloadConfig[],
    rendererConfigs: RendererConfig[],
    resourceConfigs: ResourceConfig[]
  ) {
    this.output = output;
    this.mainConfig = mainConfig;
    this.preloadConfigs = preloadConfigs;
    this.rendererConfigs = rendererConfigs;
    this.resourceConfigs = resourceConfigs;
  }
}
