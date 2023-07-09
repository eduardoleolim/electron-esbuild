import { ElectronConfig } from '../../config/domain/ElectronConfig';

export interface ElectronBuilderService {
  build(config: ElectronConfig): Promise<void>;
  dev(config: ElectronConfig): Promise<void>;
}
