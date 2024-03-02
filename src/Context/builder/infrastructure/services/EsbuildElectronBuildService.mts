import fs from 'fs';
import path from 'path';

import { ElectronConfig } from '../../../config/domain/ElectronConfig.mjs';
import { MainConfig } from '../../../config/domain/MainConfig.mjs';
import { PreloadConfig } from '../../../config/domain/PreloadConfig.mjs';
import { RendererConfig } from '../../../config/domain/RendererConfig.mjs';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from '../../../config/domain/ResourceConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';
import { ElectronBuildService } from '../../domain/ElectronBuildService.mjs';
import { EsbuildMainBuilder } from './EsbuildMainBuilder.mjs';
import { EsbuildPreloadBuilder } from './EsbuildPreloadBuilder.mjs';
import { EsbuildRendererBuilder } from './EsbuildRendererBuilder.mjs';

export class EsbuildElectronBuildService implements ElectronBuildService {
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

    this.logger.info('BUILD', `Directory ${directory} cleaned`);
  }

  async copyResources(configs: Array<ResourceConfig>, output: string): Promise<void> {
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
        this.logger.warn('BUILD', `Invalid resource config of <${config.from}>`);
      }

      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(origin, destination);
    });

    this.logger.info('BUILD', `Resources copied to ${output}`);
  }

  build(config: ElectronConfig): Promise<void>;
  build(output: string, config: MainConfig): Promise<void>;
  build(output: string, config: RendererConfig): Promise<void>;
  build(output: string, config: PreloadConfig): Promise<void>;
  async build(output: unknown, config?: unknown): Promise<void> {
    if (output instanceof ElectronConfig) {
      await this.buildMain(output.output, output.mainConfig);

      for (const rendererConfig of output.rendererConfigs) {
        await this.buildRenderer(output.output, rendererConfig);
      }
    } else if (typeof output === 'string' && config instanceof MainConfig) {
      await this.buildMain(output, config);
    } else if (typeof output === 'string' && config instanceof RendererConfig) {
      await this.buildRenderer(output, config);
    } else if (typeof output === 'string' && config instanceof PreloadConfig) {
      await this.buildPreload(output, config);
    } else {
      throw new Error('Invalid build arguments');
    }
  }

  private async buildMain(output: string, config: MainConfig): Promise<void> {
    await this.mainBuilder.build(output, config);
    this.logger.info('BUILD', 'Main process built');

    for (const preloadConfig of config.preloadConfigs) {
      await this.buildPreload(output, preloadConfig);
    }
  }

  private async buildPreload(output: string, config: PreloadConfig): Promise<void> {
    await this.preloadBuilder.build(output, config);
    this.logger.info('BUILD', 'Preload built');
  }

  private async buildRenderer(output: string, config: RendererConfig): Promise<void> {
    await this.rendererBuilder.build(output, config);
    this.logger.info('BUILD', 'Renderer built');
  }
}
