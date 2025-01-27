import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { ConfigReader } from '../domain/ConfigReader.mjs';

export class YamlConfigReader extends ConfigReader {
  private readonly sourcePath: string;

  constructor(sourcePath: string) {
    super();
    this.sourcePath = sourcePath;
  }

  public read(): unknown {
    if (!fs.existsSync(this.sourcePath)) throw new Error('Config file not found');

    return yaml.load(fs.readFileSync(this.sourcePath, 'utf8'));
  }
}
