import { LoaderConfig } from './LoaderConfig.js';

export abstract class BaseConfig {
  readonly entry: string;
  readonly pluginsEntry?: string;
  readonly loaders: ReadonlyArray<LoaderConfig>;
  readonly exclude: ReadonlyArray<string>;

  protected constructor(entry: string, loaders: LoaderConfig[], exclude: string[], pluginsEntry?: string) {
    this.entry = entry;
    this.pluginsEntry = pluginsEntry;
    this.exclude = exclude;
    this.loaders = loaders;
  }

  protected static prepareLoadersFromObject(loaders: any): LoaderConfig[] {
    if (loaders === undefined) {
      return [];
    }

    if (!Array.isArray(loaders)) {
      throw new Error(`${this.name}.prepareLoadersFromObject: loaders must be an array`);
    }

    return loaders.map(LoaderConfig.fromObject);
  }

  protected static prepareExcludesFromObject(excludes: any): string[] {
    if (excludes === undefined) {
      return [];
    }

    if (!Array.isArray(excludes)) {
      throw new Error(`${this.name}.prepareExcludesFromObject: exclude must be an array`);
    }

    return excludes.map((exclude: any) => {
      if (typeof exclude !== 'string') {
        throw new Error(`${this.name}.fromObject: <${exclude}> must be a string`);
      }

      return exclude;
    });
  }
}
