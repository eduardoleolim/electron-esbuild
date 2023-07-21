import fs from 'fs';

import { ElectronConfig } from '../../config/domain/ElectronConfig.js';
import { FileConfigParser } from '../../config/domain/FileConfigParser.js';
import { Logger } from '../../shared/domain/Logger.js';
import { ElectronBuilderService } from '../domain/ElectronBuilderService.js';

export class BuildApplication {
  private readonly parser: FileConfigParser;
  private readonly builder: ElectronBuilderService;
  private readonly logger: Logger;

  constructor(parser: FileConfigParser, builder: ElectronBuilderService, logger: Logger) {
    this.parser = parser;
    this.builder = builder;
    this.logger = logger;
  }

  public build(configPath: string, clean: boolean) {
    this.logger.info('BUILD', 'Starting build mode');
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
