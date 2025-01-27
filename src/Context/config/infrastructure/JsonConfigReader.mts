import * as fs from 'fs';

import { ConfigReader } from '../domain/ConfigReader.mjs';

export class JsonConfigReader extends ConfigReader {
  private readonly sourcePath: string;

  constructor(sourcePath: string) {
    super();
    this.sourcePath = sourcePath;
  }

  public read(): unknown {
    if (!fs.existsSync(this.sourcePath)) throw new Error('Config file not found');

    return JSON.parse(fs.readFileSync(this.sourcePath, 'utf8'));
  }
}
