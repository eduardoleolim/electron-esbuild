export class FileConfig {
  readonly from: string;
  readonly to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  static fromObject(object: any): FileConfig {
    const from = object.from;
    const to = object.to;

    if (typeof from !== 'string') {
      throw new Error('OutputConfig.fromObject: <from> must be a string');
    }

    if (typeof to !== 'string') {
      throw new Error('OutputConfig.fromObject: <to> must be a string');
    }

    return new FileConfig(from, to);
  }
}
