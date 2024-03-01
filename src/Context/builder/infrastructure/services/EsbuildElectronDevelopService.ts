import * as fs from 'fs';
import * as path from 'path';

import { ElectronConfig } from '../../../config/domain/ElectronConfig';
import { MainConfig } from '../../../config/domain/MainConfig';
import { PreloadConfig } from '../../../config/domain/PreloadConfig';
import { RendererConfig } from '../../../config/domain/RendererConfig';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from '../../../config/domain/ResourceConfig';
import { Logger } from '../../../shared/domain/Logger';
import { ElectronDevelopService } from '../../domain/ElectronDevelopService';
import { EsbuildMainBuilder } from './EsbuildMainBuilder';

export class EsbuildElectronDevelopService implements ElectronDevelopService {
  private readonly mainBuilder: EsbuildMainBuilder;
  private readonly logger: Logger;

  constructor(mainBuilder: EsbuildMainBuilder, logger: Logger) {
    this.mainBuilder = mainBuilder;
    this.logger = logger;
  }

  async clean(directory: string): Promise<void> {
    const outputDir = path.resolve(process.cwd(), directory);
    fs.rmSync(outputDir, { recursive: true, force: true });

    this.logger.info('DEVELOP', `Directory ${directory} cleaned`);
  }

  async copyResources(configs: ResourceConfig[], output: string): Promise<void> {
    configs.forEach((config) => {
      const destination = path.resolve(process.cwd(), output);
      let source = '';

      if (config instanceof SimpleResourceConfig) {
        const simpleConfig = config as SimpleResourceConfig;
        source = path.resolve(process.cwd(), simpleConfig.to);
      } else if (config instanceof CustomResourceConfig) {
        const customConfig = config as CustomResourceConfig;
        source = path.resolve(process.cwd(), customConfig.output.directory, customConfig.output.filename);
      } else {
        throw new Error('Invalid resource config');
      }

      fs.copyFileSync(source, destination);
    });

    this.logger.info('DEVELOP', `Resources copied to ${output}`);
  }

  async develop(config: ElectronConfig): Promise<void> {
    await this.developMain(config.output, config.mainConfig);

    config.rendererConfigs.forEach(async (rendererConfig) => {
      await this.developRenderer(config.output, rendererConfig);
    });
  }

  private async developMain(output: string, config: MainConfig): Promise<void> {
    this.mainBuilder.develop(output, config);
  }

  private async developRenderer(output: string, config: RendererConfig): Promise<void> {
    console.log();
  }

  private async developPreload(output: string, config: PreloadConfig): Promise<void> {
    console.log();
  }
}
