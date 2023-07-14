import { ElectronConfig, ExtraFileConfig } from '../../config/domain/ElectronConfig';

export interface ElectronBuilderService {
  build(config: ElectronConfig, clean: boolean): Promise<void>;
  dev(config: ElectronConfig, clean: boolean): Promise<void>;
  clean(config: ElectronConfig): void;
  copyExtraFiles(output: string, extraFiles: ExtraFileConfig[]): void;
}
