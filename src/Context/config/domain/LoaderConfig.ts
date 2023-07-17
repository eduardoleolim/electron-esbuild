export class LoaderConfig {
  readonly extension: string;
  readonly loader: string;

  constructor(extension: string, loader: string) {
    this.extension = extension;
    this.loader = loader;
  }

  static fromObject(object: any): LoaderConfig {
    const extension = object.extension;
    const loader = object.loader;

    if (typeof extension !== 'string') {
      throw new Error('LoaderConfig.fromObject: extension must be a string');
    }

    if (typeof loader !== 'string') {
      throw new Error('LoaderConfig.fromObject: loader must be a string');
    }

    return new LoaderConfig(extension, loader);
  }
}
