export class LoaderConfig {
  readonly fileExtension: string;
  readonly loaderName: string;

  constructor(fileExtension: string, loaderName: string) {
    this.fileExtension = fileExtension;
    this.loaderName = loaderName;
  }
}
