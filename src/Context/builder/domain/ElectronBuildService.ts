import { ElectronConfig } from '../../config/domain/ElectronConfig';
import { MainConfig } from '../../config/domain/MainConfig';
import { PreloadConfig } from '../../config/domain/PreloadConfig';
import { RendererConfig } from '../../config/domain/RendererConfig';
import { ElectronCommonService } from './ElectronCommonService';

export interface ElectronBuildService extends ElectronCommonService {
  build(config: ElectronConfig): Promise<void>;
  build(output: string, config: MainConfig): Promise<void>;
  build(output: string, config: RendererConfig): Promise<void>;
  build(output: string, config: PreloadConfig): Promise<void>;
}
