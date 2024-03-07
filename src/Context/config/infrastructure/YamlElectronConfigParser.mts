import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { ElectronConfig } from '../domain/ElectronConfig.mjs';
import { ElectronConfigParser } from '../domain/ElectronConfigParser.mjs';
import { ObjectElectronConfigParser } from './ObjectElectronConfigParser.mjs';

export class YamlElectronConfigParser extends ObjectElectronConfigParser implements ElectronConfigParser {
  parse(sourcePath: string): ElectronConfig[] {
    if (!fs.existsSync(sourcePath)) throw new Error('Config file not found');
    const yamlConfig: any = yaml.load(fs.readFileSync(sourcePath, 'utf8'));

    if (!yamlConfig) throw new Error('Invalid config file');

    if (!Array.isArray(yamlConfig)) {
      return [this.parseElectronConfig(yamlConfig)];
    } else {
      return yamlConfig.map((config) => this.parseElectronConfig(config));
    }
  }
}
