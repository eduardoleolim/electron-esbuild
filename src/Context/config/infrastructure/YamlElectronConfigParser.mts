import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { ConfigParser } from '../domain/ConfigParser.mjs';
import { ElectronConfig } from '../domain/ElectronConfig.mjs';

export class YamlElectronConfigParser extends ConfigParser {
  parse(sourcePath: string, isUsingVite: boolean): ElectronConfig[] {
    if (!fs.existsSync(sourcePath)) throw new Error('Config file not found');
    const yamlConfig: any = yaml.load(fs.readFileSync(sourcePath, 'utf8'));

    if (!yamlConfig) throw new Error('Invalid config file');

    if (!Array.isArray(yamlConfig)) {
      return [this.parseElectronConfig(yamlConfig, isUsingVite)];
    } else {
      return yamlConfig.map((config) => this.parseElectronConfig(config, isUsingVite));
    }
  }
}
