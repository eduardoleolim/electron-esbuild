import { OutputConfig } from './OutputConfig';

export class FileConfig {
  readonly from: string;
  readonly to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  static fromJson(json: any): FileConfig {
    const from = json.from;
    const to = json.to;

    if (typeof from !== 'string') {
      throw new Error('OutputConfig.fromJson: <from> must be a string');
    }

    if (typeof to !== 'string') {
      throw new Error('OutputConfig.fromJson: <to> must be a string');
    }

    return new FileConfig(from, to);
  }
}
