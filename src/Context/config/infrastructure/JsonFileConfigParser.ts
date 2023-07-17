import { FileConfigParser } from '../domain/FileConfigParser';
import fs from 'fs';

export class JsonFileConfigParser implements FileConfigParser {
  parse(path: string): any {
    if (!fs.existsSync(path)) throw new Error('Config file not found');

    const content = fs.readFileSync(path, 'utf8');
    return JSON.parse(content);
  }
}
