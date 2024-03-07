import path from 'path';

import { ElectronConfigParser } from '../../config/domain/ElectronConfigParser.mjs';
import { Logger } from '../../shared/domain/Logger.mjs';
import { ElectronDevelopService } from '../domain/ElectronDevelopService.mjs';

export class DevApplication {
  private readonly parser: ElectronConfigParser;
  private readonly builder: ElectronDevelopService;
  private readonly logger: Logger;

  constructor(parser: ElectronConfigParser, builder: ElectronDevelopService, logger: Logger) {
    this.parser = parser;
    this.builder = builder;
    this.logger = logger;
  }

  async dev(configPath: string, clean: boolean): Promise<void> {
    this.logger.log('DEV', 'Starting dev mode');
    const configs = this.parser.parse(configPath);

    for (const config of configs) {
      if (clean) {
        const outputDir = path.resolve(process.cwd(), config.output);

        await this.builder.clean(outputDir);
      }

      await this.builder.copyResources(config.resourceConfigs, config.output);

      this.builder.develop(config);
    }
  }
}
