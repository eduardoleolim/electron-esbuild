import { RendererConfig } from '../../config/domain/RendererConfig.mjs';

export interface RendererProcessBuilderService {
  build(outputDirectory: string, config: RendererConfig): Promise<void>;
  develop(outputDirectory: string, config: RendererConfig, preloadEntryPoints: string[]): Promise<void>;
}
