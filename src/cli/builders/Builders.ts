import { EsbuildElectronBuilder } from '../../Context/builder/infrastructure/services/EsbuildElectronBuilder';
import { DevApplication } from '../../Context/builder/application/DevApplication';

export const devEsbuild = new DevApplication(new EsbuildElectronBuilder());
