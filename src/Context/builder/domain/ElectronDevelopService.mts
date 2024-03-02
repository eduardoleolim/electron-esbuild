import { ElectronConfig } from '../../config/domain/ElectronConfig.mjs';
import { ElectronCommonService } from './ElectronCommonService.mjs';

export interface ElectronDevelopService extends ElectronCommonService {
  develop(config: ElectronConfig): Promise<void>;
}
