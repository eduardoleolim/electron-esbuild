import { ElectronConfig } from '../../config/domain/ElectronConfig';
import { ResourceConfig } from '../../config/domain/ResourceConfig';

export interface ElectronBuilderService {
  build(config: ElectronConfig, clean: boolean): Promise<void>;
  dev(config: ElectronConfig, clean: boolean): Promise<void>;
  clean(config: ElectronConfig): void;
  copyExtraFiles(output: string, extraFiles: ResourceConfig[]): void;
}
