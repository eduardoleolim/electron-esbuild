import { RendererConfig } from './RendererConfig';
import { MainConfig } from './MainConfig';

export class ElectronConfig {
  readonly main: MainConfig;
  readonly renderers: ReadonlyArray<RendererConfig>;

  constructor(main: MainConfig, renderers: RendererConfig[]) {
    this.main = main;
    this.renderers = renderers;
  }

  private static prepareRenderersFromJson(renderers: any): RendererConfig[] {
    if (renderers === undefined) {
      return [];
    }

    if (!Array.isArray(renderers)) {
      renderers = [renderers];
    }

    return renderers.map(RendererConfig.fromJson);
  }

  public static fromJson(json: any): ElectronConfig {
    if (json.main === undefined) {
      throw new Error('ElectronConfig.fromJson: main is required');
    }
    const main = MainConfig.fromJson(json.main);
    const renderers = ElectronConfig.prepareRenderersFromJson(json.renderers);

    return new ElectronConfig(main, renderers);
  }
}
