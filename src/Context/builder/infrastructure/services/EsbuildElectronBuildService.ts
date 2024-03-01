import fs from 'fs';
import path from 'path';

import { ElectronConfig } from '../../../config/domain/ElectronConfig';
import { MainConfig } from '../../../config/domain/MainConfig';
import { PreloadConfig } from '../../../config/domain/PreloadConfig';
import { RendererConfig } from '../../../config/domain/RendererConfig';
import { CustomResourceConfig, ResourceConfig, SimpleResourceConfig } from '../../../config/domain/ResourceConfig';
import { Logger } from '../../../shared/domain/Logger';
import { ElectronBuildService } from '../../domain/ElectronBuildService';
import { EsbuildMainBuilder } from './EsbuildMainBuilder';

export class EsbuildElectronBuildService implements ElectronBuildService {
  private readonly mainBuilder: EsbuildMainBuilder;
  private readonly logger: Logger;

  constructor(mainBuilder: EsbuildMainBuilder, logger: Logger) {
    this.mainBuilder = mainBuilder;
    this.logger = logger;
  }

  async clean(directory: string): Promise<void> {
    const outputDir = path.resolve(__dirname, directory);
    fs.rmSync(outputDir, { recursive: true, force: true });

    this.logger.info('BUILD', `Directory ${directory} cleaned`);
  }

  async copyResources(configs: Array<ResourceConfig>, output: string): Promise<void> {
    configs.forEach((config) => {
      const destination = path.resolve(__dirname, output);
      let source = '';

      if (config instanceof SimpleResourceConfig) {
        const simpleConfig = config as SimpleResourceConfig;
        source = path.resolve(__dirname, simpleConfig.to);
      } else if (config instanceof CustomResourceConfig) {
        const customConfig = config as CustomResourceConfig;
        source = path.resolve(__dirname, customConfig.output.directory, customConfig.output.filename);
      } else {
        throw new Error('Invalid resource config');
      }

      fs.copyFileSync(source, destination);
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
    this.logger.info('BUILD', 'Preload built');
  }

  private async buildRenderer(output: string, config: RendererConfig): Promise<void> {
    this.logger.info('BUILD', 'Renderer built');
  }
}
