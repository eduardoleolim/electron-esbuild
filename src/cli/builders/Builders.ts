import { EsbuildElectronBuilder } from '../../Context/builder/infrastructure/services/EsbuildElectronBuilder';
import { DevApplication } from '../../Context/builder/application/DevApplication';
import { loaders } from '../../Context/shared/infrastructure/esbuidLoaders';
import { BuildApplication } from '../../Context/builder/application/BuildApplication';

export const devEsbuild = new DevApplication(new EsbuildElectronBuilder(loaders));

export const buildEsbuild = new BuildApplication(new EsbuildElectronBuilder(loaders));
