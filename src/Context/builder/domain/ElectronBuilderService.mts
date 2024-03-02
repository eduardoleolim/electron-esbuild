import { ElectronConfig } from '../../config/domain/ElectronConfig.mjs';
import { ResourceConfig } from '../../config/domain/ResourceConfig.mjs';

export interface ElectronBuilderService {
  build(config: ElectronConfig, clean: boolean): Promise<void>;
  dev(config: ElectronConfig, clean: boolean): Promise<void>;
  clean(config: ElectronConfig): void;
  copyExtraFiles(output: string, extraFiles: ResourceConfig[]): void;
}
