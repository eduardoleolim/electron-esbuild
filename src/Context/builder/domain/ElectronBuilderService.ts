import { ElectronConfig } from '../../config/domain/ElectronConfig';

export interface ElectronBuilderService {
  build(config: ElectronConfig, clean: boolean): Promise<void>;
  dev(config: ElectronConfig, clean: boolean): Promise<void>;
  clean(config: ElectronConfig): void;
}
