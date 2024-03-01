import path from 'path';

import { ElectronConfigParser } from '../../config/domain/ElectronConfigParser';
import { Logger } from '../../shared/domain/Logger';
import { ElectronDevelopService } from '../domain/ElectronDevelopService';

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
    const config = this.parser.parse(configPath);

    if (clean) {
      const outputDir = path.resolve(process.cwd(), config.output);

      await this.builder.clean(outputDir);
    }

    this.builder.develop(config);
  }
}
