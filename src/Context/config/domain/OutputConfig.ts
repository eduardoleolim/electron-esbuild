export class OutputConfig {
  readonly directory: string;
  readonly filename: string;

  constructor(directory: string, filename: string) {
    this.directory = directory;
    this.filename = filename;
  }
}
