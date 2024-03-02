import * as fs from 'fs';

import { ElectronConfig } from '../domain/ElectronConfig.mjs';
import { ElectronConfigParser } from '../domain/ElectronConfigParser.mjs';
import { ObjectElectronConfigParser } from './ObjectElectronConfigParser.mjs';

export class JsonElectronConfigParser extends ObjectElectronConfigParser implements ElectronConfigParser {
  parse(sourcePath: string): ElectronConfig {
    if (!fs.existsSync(sourcePath)) throw new Error('Config file not found');
    const jsonConfig: any = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    return this.parseElectronConfig(jsonConfig);
  }
}
