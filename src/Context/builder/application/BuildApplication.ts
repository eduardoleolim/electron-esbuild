import { ElectronBuilderService } from '../domain/ElectronBuilderService';
import { ElectronConfig } from '../../config/domain/ElectronConfig';
import fs from 'fs';
import { FileConfigParser } from '../../config/domain/FileConfigParser';

export class BuildApplication {
  private readonly parser: FileConfigParser;
  private readonly builder: ElectronBuilderService;

  constructor(parser: FileConfigParser, builder: ElectronBuilderService) {
    this.parser = parser;
    this.builder = builder;
  }

  public build(configPath: string, clean: boolean) {
    const configs = this.prepareConfigs(configPath);
    configs.forEach((config) => this.builder.build(config, clean));
  }

  private prepareConfigs(configPath: string): ElectronConfig[] {
    if (!fs.existsSync(configPath)) throw new Error('Config file not found');

    let configs = this.parser.parse(configPath);
    if (!Array.isArray(configs)) {
      configs = [configs];
    }

    return configs.map(ElectronConfig.fromObject);
  }
}
