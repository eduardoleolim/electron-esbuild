import { PreloadConfig } from '../../config/domain/PreloadConfig.mjs';

export interface PreloadBuilderService {
  build(outputDirectory: string, config: PreloadConfig): Promise<void>;
  develop(outputDirectory: string, config: PreloadConfig): Promise<void>;
}
