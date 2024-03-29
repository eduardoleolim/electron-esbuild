import * as fs from 'fs';

import { ConfigParser } from '../domain/ConfigParser.mjs';
import { ElectronConfig } from '../domain/ElectronConfig.mjs';

export class JsonElectronConfigParser extends ConfigParser {
  parse(sourcePath: string): ElectronConfig[] {
    if (!fs.existsSync(sourcePath)) throw new Error('Config file not found');
    const jsonConfig: any = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    if (!jsonConfig) throw new Error('Invalid config file');

    if (!Array.isArray(jsonConfig)) {
      return [this.parseElectronConfig(jsonConfig)];
    } else {
      return jsonConfig.map((config) => this.parseElectronConfig(config));
    }
  }
}
