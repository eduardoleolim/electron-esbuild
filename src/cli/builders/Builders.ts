import { EsbuildElectronBuilder } from '../../Context/builder/infrastructure/services/EsbuildElectronBuilder';
import { DevApplication } from '../../Context/builder/application/DevApplication';
import { loaders } from '../../Context/shared/infrastructure/esbuidLoaders';
import { BuildApplication } from '../../Context/builder/application/BuildApplication';
import { JsonFileConfigParser } from '../../Context/config/infrastructure/JsonFileConfigParser';

const jsonParser = new JsonFileConfigParser();
const esbuildBuilder = new EsbuildElectronBuilder(loaders);

export const jsonDevEsbuild = new DevApplication(jsonParser, esbuildBuilder);
export const jsonBuildEsbuild = new BuildApplication(jsonParser, esbuildBuilder);
