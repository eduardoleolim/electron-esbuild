import { ElectronConfig } from '../../config/domain/ElectronConfig.mjs';
import { MainConfig } from '../../config/domain/MainConfig.mjs';
import { PreloadConfig } from '../../config/domain/PreloadConfig.mjs';
import { RendererConfig } from '../../config/domain/RendererConfig.mjs';
import { ElectronCommonService } from './ElectronCommonService.mjs';

export interface ElectronBuildService extends ElectronCommonService {
  build(config: ElectronConfig): Promise<void>;
  build(output: string, config: MainConfig): Promise<void>;
  build(output: string, config: RendererConfig): Promise<void>;
  build(output: string, config: PreloadConfig): Promise<void>;
}
