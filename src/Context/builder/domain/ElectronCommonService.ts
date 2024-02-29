import { ResourceConfig } from '../../config/domain/ResourceConfig';

export interface ElectronCommonService {
  clean(directory: string): Promise<void>;
  copyResources(configs: Array<ResourceConfig>, output: string): Promise<void>;
}
