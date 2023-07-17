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

  public static fromObject(object: any): ElectronConfig {
    let output = object.output;

    if (output === undefined) {
      output = 'dist';
      console.warn(`ElectronConfig.fromObject: output is undefined, using default value: ${output}`);
    } else if (typeof output !== 'string') {
      throw new Error('ElectronConfig.fromObject: output must be a string');
    } else {
      output = path.resolve(output);
    }

    if (object.main === undefined) {
      throw new Error('ElectronConfig.fromObject: main is required');
    }
    const main = MainConfig.fromObject(object.main);
    const renderers = ElectronConfig.prepareRenderersFromObject(object.renderers);

    const extraFiles: (string | FileConfig)[] = [];

    if (Array.isArray(object.extraFiles)) {
      for (let i = 0; i < object.extraFiles.length; i++) {
        const fileConfig = object.extraFiles[i];

        if (typeof fileConfig === 'string') {
          extraFiles.push(fileConfig);
          continue;
        }

        try {
          extraFiles.push(FileConfig.fromObject(fileConfig));
        } catch (error: any) {
          console.log(error.message);
        }
      }
    }

    return new ElectronConfig(output, main, renderers, extraFiles);
  }

  private static prepareRenderersFromObject(renderers: any): RendererConfig[] {
    if (renderers === undefined) {
      return [];
    }

    if (!Array.isArray(renderers)) {
      renderers = [renderers];
    }

    return renderers.map(RendererConfig.fromObject);
  }
}
