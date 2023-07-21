import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { FileConfigParser } from '../domain/FileConfigParser.js';

export class YamlFileConfigParser implements FileConfigParser {
  public parse(path: string): any {
    if (!fs.existsSync(path)) throw new Error('Config file not found');
    return yaml.load(fs.readFileSync(path, 'utf8'));
  }
}
