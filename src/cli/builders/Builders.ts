import { EsbuildElectronBuilder } from '../../Context/builder/infrastructure/services/EsbuildElectronBuilder';
import { DevApplication } from '../../Context/builder/application/DevApplication';
import { loaders } from '../../Context/shared/infrastructure/esbuidLoaders';

export const devEsbuild = new DevApplication(new EsbuildElectronBuilder(loaders));
