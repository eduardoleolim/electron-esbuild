import { EsbuildElectronBuilder } from '../../Context/builder/infrastructure/services/EsbuildElectronBuilder';
import { DevApplication } from '../../Context/builder/application/DevApplication';
import { loaders } from '../../Context/shared/infrastructure/esbuidLoaders';
import { BuildApplication } from '../../Context/builder/application/BuildApplication';
import { JsonFileConfigParser } from '../../Context/config/infrastructure/JsonFileConfigParser';
import { YamlFileConfigParser } from '../../Context/config/infrastructure/YamlFileConfigParser';

const jsonParser = new JsonFileConfigParser();
const yamlParser = new YamlFileConfigParser();

const esbuildBuilder = new EsbuildElectronBuilder(loaders);

export const jsonDevEsbuild = new DevApplication(jsonParser, esbuildBuilder);
export const jsonBuildEsbuild = new BuildApplication(jsonParser, esbuildBuilder);

export const yamlDevEsbuild = new DevApplication(yamlParser, esbuildBuilder);
export const yamlBuildEsbuild = new BuildApplication(yamlParser, esbuildBuilder);
