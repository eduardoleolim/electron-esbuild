import path from 'path';

export class OutputConfig {
  readonly directory: string;
  readonly filename: string;

  constructor(directory: string, filename: string) {
    this.directory = directory;
    this.filename = filename;
  }

  static fromJson(json: any): OutputConfig {
    const directory = json.directory;
    const filename = json.filename;

    if (typeof directory !== 'string') {
      throw new Error('OutputConfig.fromJson: directory must be a string');
    }

    if (path.isAbsolute(directory)) {
      throw new Error('OutputConfig.fromJson: directory must be a relative path');
    }

    if (typeof filename !== 'string') {
      throw new Error('OutputConfig.fromJson: filename must be a string');
    }

    return new OutputConfig(directory, filename);
  }
}
