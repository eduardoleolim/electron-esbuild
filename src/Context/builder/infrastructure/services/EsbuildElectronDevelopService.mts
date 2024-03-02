import * as fs from 'fs';
import * as path from 'path';

import { ElectronConfig } from '../../../config/domain/ElectronConfig.mjs';
import { MainConfig } from '../../../config/domain/MainConfig.mjs';
import { PreloadConfig } from '../../../config/domain/PreloadConfig.mjs';
import { RendererConfig } from '../../../config/domain/RendererConfig.mjs';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from '../../../config/domain/ResourceConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';
import { ElectronDevelopService } from '../../domain/ElectronDevelopService.mjs';
import { EsbuildMainBuilder } from './EsbuildMainBuilder.mjs';
import { EsbuildPreloadBuilder } from './EsbuildPreloadBuilder.mjs';
import { EsbuildRendererBuilder } from './EsbuildRendererBuilder.mjs';

export class EsbuildElectronDevelopService implements ElectronDevelopService {
  private readonly mainBuilder: EsbuildMainBuilder;
  private readonly preloadBuilder: EsbuildPreloadBuilder;
  private readonly rendererBuilder: EsbuildRendererBuilder;
  private readonly logger: Logger;

  constructor(
    mainBuilder: EsbuildMainBuilder,
    preloadBuilder: EsbuildPreloadBuilder,
    rendererBuilder: EsbuildRendererBuilder,
    logger: Logger,
  ) {
    this.mainBuilder = mainBuilder;
    this.preloadBuilder = preloadBuilder;
    this.rendererBuilder = rendererBuilder;
    this.logger = logger;
  }

  async clean(directory: string): Promise<void> {
    const outputDir = path.resolve(process.cwd(), directory);
    fs.rmSync(outputDir, { recursive: true, force: true });

    this.logger.info('DEVELOP', `Directory ${directory} cleaned`);
  }

  async copyResources(configs: ResourceConfig[], output: string): Promise<void> {
    configs.forEach((config) => {
      const origin = path.resolve(process.cwd(), config.from);
      let destination = ""

      if (config instanceof SimpleResourceConfig) {
        const simpleConfig = config as SimpleResourceConfig;
        destination = path.resolve(process.cwd(), output, simpleConfig.to);
      } else if (config instanceof CustomResourceConfig) {
        const customConfig = config as CustomResourceConfig;
        destination = path.resolve(process.cwd(), output, customConfig.output.directory, customConfig.output.filename);
      } else {
        this.logger.warn('DEVELOP', `Invalid resource config of <${config.from}>`);
      }

      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(origin, destination);
    });

    this.logger.info('DEVELOP', `Resources copied to ${output}`);
  }

  async develop(config: ElectronConfig): Promise<void> {
    await this.developMain(config.output, config.mainConfig);

    await this.copyResources(config.resourceConfigs, config.output);

    config.mainConfig.preloadConfigs.forEach(async (preloadConfig) => {
      await this.developPreload(config.output, preloadConfig);
    });

    config.rendererConfigs.forEach(async (rendererConfig) => {
      await this.developRenderer(config.output, rendererConfig);
    });
  }

  private async developMain(output: string, config: MainConfig): Promise<void> {
    this.mainBuilder.develop(output, config);
  }

  private async developRenderer(output: string, config: RendererConfig): Promise<void> {
    this.rendererBuilder.develop(output, config);
  }

  private async developPreload(output: string, config: PreloadConfig): Promise<void> {
    this.preloadBuilder.develop(output, config);
  }
}
