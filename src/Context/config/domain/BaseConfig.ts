export abstract class BaseConfig {
  readonly pluginsEntry?: string;

  protected constructor(pluginsEntry?: string) {
    this.pluginsEntry = pluginsEntry;
  }
}
