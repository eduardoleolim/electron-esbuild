import { ResourceConfig } from '../../config/domain/ResourceConfig.mjs';

export interface ElectronCommonService {
  clean(directory: string): Promise<void>;
  copyResources(configs: Array<ResourceConfig>, output: string): Promise<void>;
}
