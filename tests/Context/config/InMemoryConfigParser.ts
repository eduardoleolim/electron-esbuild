import * as fs from 'fs';

import { ConfigParser } from '../../../src/Context/config/domain/ConfigParser.mjs';
import { ElectronConfig } from '../../../src/Context/config/domain/ElectronConfig.mjs';

export class InMemoryConfigParser extends ConfigParser {
  parse(sourcePath: string, isUsingVite: boolean): ElectronConfig[] {
    if (!fs.existsSync(sourcePath)) throw new Error('Config file not found');
    const jsonConfig: unknown = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

    if (!jsonConfig) throw new Error('Invalid config file');

    if (!Array.isArray(jsonConfig)) {
      return [this.parseElectronConfig(jsonConfig, isUsingVite)];
    } else {
      return jsonConfig.map((config) => this.parseElectronConfig(config, isUsingVite));
    }
  }
}
