import path from 'path';

import { ElectronConfigParser } from '../../config/domain/ElectronConfigParser';
import { Logger } from '../../shared/domain/Logger';
import { ElectronBuildService } from '../domain/ElectronBuildService';

export class BuildApplication {
  private readonly parser: ElectronConfigParser;
  private readonly builder: ElectronBuildService;
  private readonly logger: Logger;

  constructor(parser: ElectronConfigParser, builder: ElectronBuildService, logger: Logger) {
    this.parser = parser;
    this.builder = builder;
    this.logger = logger;
  }

  public async build(configPath: string, clean: boolean) {
    this.logger.info('BUILD', 'Starting build process');
    const config = this.parser.parse(configPath);

    if (clean) {
      const outputDir = path.resolve(process.cwd(), config.output);

      await this.builder.clean(outputDir);
    }

    await this.builder.build(config);

    if (config.resourceConfigs.length > 0) {
      await this.builder.copyResources(config.resourceConfigs, config.output);
    }

    this.logger.info('BUILD', 'Build finished');
  }
}
