import { MainConfig } from '../../config/domain/MainConfig.mjs';

export interface MainProcessBuilderService {
  build(putputDirectory: string, config: MainConfig): Promise<void>;
  develop(outputDirectory: string, config: MainConfig): Promise<void>;
}
