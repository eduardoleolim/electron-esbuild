import { ElectronConfig, ExtraFile } from '../../config/domain/ElectronConfig.js';

export interface ElectronBuilderService {
  build(config: ElectronConfig, clean: boolean): Promise<void>;
  dev(config: ElectronConfig, clean: boolean): Promise<void>;
  clean(config: ElectronConfig): void;
  copyExtraFiles(output: string, extraFiles: ExtraFile[]): void;
}
