import { RendererConfig } from './RendererConfig';
import { MainConfig } from './MainConfig';
import path from 'path';
import { FileConfig } from './FileConfig';

export type ExtraFileConfig = string | FileConfig;

export class ElectronConfig {
  readonly output: string;
  readonly main: MainConfig;
  readonly renderers: ReadonlyArray<RendererConfig>;
  readonly extraFiles: ExtraFileConfig[];

  constructor(output: string, main: MainConfig, renderers: RendererConfig[], extraFiles: ExtraFileConfig[]) {
    this.output = output;
    this.main = main;
    this.renderers = renderers;
    this.extraFiles = extraFiles;
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

    const extraFiles: (string | FileConfig)[] = [];

    if (Array.isArray(json.extraFiles)) {
      for (let i = 0; i < json.extraFiles.length; i++) {
        const fileConfig = json.extraFiles[i];

        if (typeof fileConfig === 'string') {
          extraFiles.push(fileConfig);
          continue;
        }

        try {
          extraFiles.push(FileConfig.fromJson(fileConfig));
        } catch (error: any) {
          console.log(error.message);
        }
      }
    }

    return new ElectronConfig(output, main, renderers, extraFiles);
  }
}
