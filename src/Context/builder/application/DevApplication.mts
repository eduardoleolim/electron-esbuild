import { ConfigParser } from '../../config/domain/ConfigParser.mjs';
import { ConfigReader } from '../../config/domain/ConfigReader.mjs';
import { MainConfig } from '../../config/domain/MainConfig.mjs';
import { PreloadConfig } from '../../config/domain/PreloadConfig.mjs';
import { RendererConfig } from '../../config/domain/RendererConfig.mjs';
import { Logger } from '../../shared/domain/Logger.mjs';
import { MainProcessBuilderService } from '../domain/MainProcessBuilderService.mjs';
import { PreloadBuilderService } from '../domain/PreloadBuilderService.mjs';
import { RendererProcessBuilderService } from '../domain/RendererProcessBuilderService.mjs';
import { BaseApplication } from './BaseApplication.mjs';

export class DevApplication extends BaseApplication {
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

  public async develop(configReader: ConfigReader, clean: boolean, isUsingVite: boolean): Promise<void> {
    const configs = this.configParser.parse(configReader, isUsingVite);

    for (const config of configs) {
      if (clean) {
        await this.clean(config.output);
      }

      await this.copyResources(config.output, config.resourceConfigs);

      for (const preloadConfig of config.preloadConfigs) {
        await this.developPreload(config.output, preloadConfig);
      }

      for (const rendererConfig of config.rendererConfigs) {
        const rendererIndex: number = config.rendererConfigs.indexOf(rendererConfig);
        const preloadEntryPoints: string[] = config.preloadConfigs
          .filter((preloadConfig) => preloadConfig.rendererProcesses.includes(rendererIndex))
          .map((preloadConfig) => preloadConfig.entryPoint);

        await this.developRenderer(config.output, rendererConfig, preloadEntryPoints);
      }

      await this.developMain(config.output, config.mainConfig);
    }
  }

  private async developMain(outputDirectory: string, config: MainConfig): Promise<void> {
    await this.mainBuilder.develop(outputDirectory, config);
  }

  private async developPreload(outputDirectory: string, config: PreloadConfig): Promise<void> {
    await this.preloadBuilder.develop(outputDirectory, config);
  }

  private async developRenderer(
    outputDirectory: string,
    config: RendererConfig,
    preloadEntryPoints: string[]
  ): Promise<void> {
    await this.rendererBuilder.develop(outputDirectory, config, preloadEntryPoints);
  }
}
