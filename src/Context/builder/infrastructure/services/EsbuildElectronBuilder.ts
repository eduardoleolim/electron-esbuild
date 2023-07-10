import { ElectronBuilderService } from '../../domain/ElectronBuilderService';
import { ElectronConfig } from '../../../config/domain/ElectronConfig';
import { MainEsbuildElectronBuilder } from './MainEsbuildElectronBuilder';
import { MainProcessStarter } from './MainProcessStarter';

export class EsbuildElectronBuilder implements ElectronBuilderService {
  async build(config: ElectronConfig): Promise<void> {
    return Promise.resolve(undefined);
  }

  async dev(config: ElectronConfig): Promise<void> {
    const mainBuilder = new MainEsbuildElectronBuilder(config.main);
    const mainProcessStarter = new MainProcessStarter(config.main);

    await mainBuilder.build();
    await mainProcessStarter.start();
    await mainBuilder.dev(mainProcessStarter.start.bind(mainProcessStarter));
  }
}