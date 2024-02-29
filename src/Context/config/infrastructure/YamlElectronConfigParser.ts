import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { ElectronConfig } from '../domain/ElectronConfig';
import { ElectronConfigParser } from '../domain/ElectronConfigParser';
import { ObjectElectronConfigParser } from './ObjectElectronConfigParser';

export class YamlElectronConfigParser extends ObjectElectronConfigParser implements ElectronConfigParser {
  parse(sourcePath: string): ElectronConfig {
    if (!fs.existsSync(sourcePath)) throw new Error('Config file not found');
    const yamlConfig: any = yaml.load(fs.readFileSync(sourcePath, 'utf8'));

    return this.parseElectronConfig(yamlConfig);
  }
}
