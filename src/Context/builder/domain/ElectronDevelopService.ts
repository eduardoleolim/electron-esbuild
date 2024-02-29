import { ElectronConfig } from '../../config/domain/ElectronConfig';
import { ElectronCommonService } from './ElectronCommonService';

export interface ElectronDevelopService extends ElectronCommonService {
  develop(config: ElectronConfig): Promise<void>;
}
