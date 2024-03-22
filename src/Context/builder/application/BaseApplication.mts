import fs from 'fs';
import path from 'path';

import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from '../../config/domain/ResourceConfig.mjs';
import { Logger } from '../../shared/domain/Logger.mjs';

export abstract class BaseApplication {
  protected readonly logger: Logger;
  private loggerScope: string;

  constructor(logger: Logger) {
    this.logger = logger;
    if (process.env.NODE_ENV === 'production') {
      this.loggerScope = 'BUILD';
    } else {
      this.loggerScope = 'DEVELOP';
    }
  }

  public async copyResources(outputDirectory: string, configs: ResourceConfig[]): Promise<void> {
    for (const config of configs) {
      const origin = path.resolve(process.cwd(), config.from);
      let destination = '';

      if (config instanceof SimpleResourceConfig) {
        const simpleConfig = config as SimpleResourceConfig;
        destination = path.resolve(process.cwd(), outputDirectory, simpleConfig.to);
      } else if (config instanceof CustomResourceConfig) {
        const customConfig = config as CustomResourceConfig;
        destination = path.resolve(
          process.cwd(),
          outputDirectory,
          customConfig.output.directory,
          customConfig.output.filename,
        );
      } else {
        this.logger.warn('DEVELOP', `Invalid resource config of <${config.from}>`);
      }

      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(origin, destination);
    }

    this.logger.info(this.loggerScope, `Resources copied to ${outputDirectory}`);
  }

  public async clean(outputDirectory: string): Promise<void> {
    const outputDir = path.resolve(process.cwd(), outputDirectory);
    fs.rmSync(outputDir, { recursive: true, force: true });

    this.logger.info(this.loggerScope, `Directory ${outputDirectory} cleaned`);
  }
}
