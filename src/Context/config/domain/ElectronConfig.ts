import { RendererConfig } from './RendererConfig';
import { MainConfig } from './MainConfig';
import path from 'path';

export class ElectronConfig {
  readonly output: string;
  readonly main: MainConfig;
  readonly renderers: ReadonlyArray<RendererConfig>;

  constructor(output: string, main: MainConfig, renderers: RendererConfig[]) {
    this.output = output;
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
    let output = json.output;

    if (output === undefined) {
      output = 'dist';
      console.warn(`ElectronConfig.fromJson: output is undefined, using default value: ${output}`);
    } else if (typeof output !== 'string') {
      throw new Error('ElectronConfig.fromJson: output must be a string');
    } else {
      output = path.resolve(output);
    }

    if (json.main === undefined) {
      throw new Error('ElectronConfig.fromJson: main is required');
    }
    const main = MainConfig.fromJson(json.main);
    const renderers = ElectronConfig.prepareRenderersFromJson(json.renderers);

    return new ElectronConfig(output, main, renderers);
  }
}
