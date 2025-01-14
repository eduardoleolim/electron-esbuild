import { ConfigParser } from '../../config/domain/ConfigParser.mjs';
import { MainConfig } from '../../config/domain/MainConfig.mjs';
import { PreloadConfig } from '../../config/domain/PreloadConfig.mjs';
import { RendererConfig } from '../../config/domain/RendererConfig.mjs';
import { Logger } from '../../shared/domain/Logger.mjs';
import { MainProcessBuilderService } from '../domain/MainProcessBuilderService.mjs';
import { PreloadBuilderService } from '../domain/PreloadBuilderService.mjs';
import { RendererProcessBuilderService } from '../domain/RendererProcessBuilderService.mjs';
import { BaseApplication } from './BaseApplication.mjs';

export class BuildApplication extends BaseApplication {
  private readonly configParser: ConfigParser;
  private readonly mainBuilder: MainProcessBuilderService;
  private readonly rendererBuilder: RendererProcessBuilderService;
  private readonly preloadBuilder: PreloadBuilderService;

  constructor(
    configParser: ConfigParser,
    mainBuilder: MainProcessBuilderService,
    rendererBuilder: RendererProcessBuilderService,
    preloadBuilder: PreloadBuilderService,
    logger: Logger
  ) {
    super(logger);
    this.configParser = configParser;
    this.mainBuilder = mainBuilder;
    this.rendererBuilder = rendererBuilder;
    this.preloadBuilder = preloadBuilder;
  }

  public async build(configEntryPoint: string, clean: boolean, isUsingVite: boolean): Promise<void> {
    const configs = this.configParser.parse(configEntryPoint, isUsingVite);

    for (const config of configs) {
      if (clean) {
        await this.clean(config.output);
      }

      await this.buildMain(config.output, config.mainConfig);

      for (const preloadConfig of config.preloadConfigs) {
        await this.buildPreload(config.output, preloadConfig);
      }

      for (const rendererConfig of config.rendererConfigs) {
        await this.buildRenderer(config.output, rendererConfig);
      }

      await this.copyResources(config.output, config.resourceConfigs);
    }
  }

  private async buildMain(outputDirectory: string, config: MainConfig): Promise<void> {
    await this.mainBuilder.build(outputDirectory, config);
  }

  private async buildPreload(outputDirectory: string, config: PreloadConfig): Promise<void> {
    await this.preloadBuilder.build(outputDirectory, config);
  }

  private async buildRenderer(outputDirectory: string, config: RendererConfig): Promise<void> {
    await this.rendererBuilder.build(outputDirectory, config);
  }
}
