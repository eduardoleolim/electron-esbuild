import path from 'path';

export class OutputConfig {
  readonly directory: string;
  readonly filename: string;

  constructor(directory: string, filename: string) {
    this.directory = directory;
    this.filename = filename;
  }

  static fromObject(object: any): OutputConfig {
    const directory = object.directory;
    const filename = object.filename;

    if (typeof directory !== 'string') {
      throw new Error('OutputConfig.fromObject: directory must be a string');
    }

    if (path.isAbsolute(directory)) {
      throw new Error('OutputConfig.fromObject: directory must be a relative path');
    }

    if (typeof filename !== 'string') {
      throw new Error('OutputConfig.fromObject: filename must be a string');
    }

    return new OutputConfig(directory, filename);
  }
}
