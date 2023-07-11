import { ElectronBuilderService } from '../../domain/ElectronBuilderService';
import { ElectronConfig } from '../../../config/domain/ElectronConfig';
import { MainEsbuildElectronBuilder } from './MainEsbuildElectronBuilder';
import { MainProcessStarter } from './MainProcessStarter';
import { RendererEsbuildElectronBuilder } from './RendererEsbuildElectronBuilder';

export class EsbuildElectronBuilder implements ElectronBuilderService {
  private readonly loaders: string[];

  constructor(loaders: string[]) {
    this.loaders = loaders;
  }

  async build(config: ElectronConfig): Promise<void> {
    return Promise.resolve(undefined);
  }

  async dev(config: ElectronConfig): Promise<void> {
    const mainBuilder = new MainEsbuildElectronBuilder(config.main, this.loaders);
    const mainProcessStarter = new MainProcessStarter(config.main);
    const rendererBuilders = config.renderers.map((rendererConfig) => {
      return new RendererEsbuildElectronBuilder(config.main, rendererConfig, this.loaders);
    });

    await Promise.all(rendererBuilders.map((builder) => builder.dev()));

    await mainBuilder.build();
    await mainProcessStarter.start();
    await mainBuilder.dev(mainProcessStarter.start.bind(mainProcessStarter));
  }
}
