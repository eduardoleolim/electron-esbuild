export class LoaderConfig {
  readonly extension: string;
  readonly loader: string;

  constructor(extension: string, loader: string) {
    this.extension = extension;
    this.loader = loader;
  }

  static fromJson(json: any): LoaderConfig {
    const extension = json.extension;
    const loader = json.loader;

    if (typeof extension !== 'string') {
      throw new Error('LoaderConfig.fromJson: extension must be a string');
    }

    if (typeof loader !== 'string') {
      throw new Error('LoaderConfig.fromJson: loader must be a string');
    }

    return new LoaderConfig(extension, loader);
  }
}
