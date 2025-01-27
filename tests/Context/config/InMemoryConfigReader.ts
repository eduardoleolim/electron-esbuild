import { ConfigReader } from '../../../src/Context/config/domain/ConfigReader.mts';

export class InMemoryConfigReader extends ConfigReader {
  private config: unknown;

  public read(): unknown {
    return this.config;
  }

  public setConfig(config: unknown): void {
    this.config = config;
  }
}
