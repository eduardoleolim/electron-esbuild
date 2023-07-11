import { ElectronBuilderService } from '../../domain/ElectronBuilderService';
import { ElectronConfig } from '../../../config/domain/ElectronConfig';
import { MainEsbuildElectronBuilder } from './MainEsbuildElectronBuilder';
import { MainProcessStarter } from './MainProcessStarter';
import { RendererEsbuildElectronBuilder } from './RendererEsbuildElectronBuilder';
import path from 'path';
import fs from 'fs';

export class EsbuildElectronBuilder implements ElectronBuilderService {
  private readonly loaders: string[];

  constructor(loaders: string[]) {
    this.loaders = loaders;
  }

  clean(config: ElectronConfig) {
    const outputDirectory = path.resolve(config.output);
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }

  async build(config: ElectronConfig, clean: boolean): Promise<void> {
    if (clean) {
      this.clean(config);
    }

    const mainBuilder = new MainEsbuildElectronBuilder(config.main, config.output, this.loaders);
    const rendererBuilders = config.renderers.map((rendererConfig) => {
      return new RendererEsbuildElectronBuilder(config.main, rendererConfig, config.output, this.loaders);
    });

    await Promise.all(rendererBuilders.map((builder) => builder.build()));
    await mainBuilder.build();
  }

  async dev(config: ElectronConfig, clean: boolean): Promise<void> {
    if (clean) {
      this.clean(config);
    }

    const mainBuilder = new MainEsbuildElectronBuilder(config.main, config.output, this.loaders);
    const mainProcessStarter = new MainProcessStarter(config.main, config.output);
    const rendererBuilders = config.renderers.map((rendererConfig) => {
      return new RendererEsbuildElectronBuilder(config.main, rendererConfig, config.output, this.loaders);
    });

    await Promise.all(rendererBuilders.map((builder) => builder.dev()));

    await mainBuilder.build();
    await mainProcessStarter.start();
    await mainBuilder.dev(mainProcessStarter.start.bind(mainProcessStarter));
  }
}
