import { Command } from 'commander';
import * as fs from 'fs';
import path from 'path';

import { BuildApplication } from '../../Context/builder/application/BuildApplication';
import { DevApplication } from '../../Context/builder/application/DevApplication';
import { EsbuildElectronBuildService } from '../../Context/builder/infrastructure/services/EsbuildElectronBuildService';
import { EsbuildElectronDevelopService } from '../../Context/builder/infrastructure/services/EsbuildElectronDevelopService';
import { EsbuildMainBuilder } from '../../Context/builder/infrastructure/services/EsbuildMainBuilder';
import { EsbuildPreloadBuilder } from '../../Context/builder/infrastructure/services/EsbuildPreloadBuilder';
import { EsbuildRendererBuilder } from '../../Context/builder/infrastructure/services/EsbuildRendererBuilder';
import { JsonElectronConfigParser } from '../../Context/config/infrastructure/JsonElectronConfigParser';
import { YamlElectronConfigParser } from '../../Context/config/infrastructure/YamlElectronConfigParser';
import { Logger } from '../../Context/shared/domain/Logger';
import { loaders } from '../../Context/shared/infrastructure/esbuidLoaders';

type Options = {
  config?: string;
};

type DevOptions = Options & {
  clean?: boolean;
};

type BuildOptions = Options;

export class CommandLine {
  private readonly program: Command;
  private readonly packageJson: any;
  private readonly jsonEsbuildDev: DevApplication;
  private readonly jsonEsbuildBuild: BuildApplication;
  private readonly yamlEsbuildDev: DevApplication;
  private readonly yamlEsbuildBuild: BuildApplication;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8'));
    this.logger = logger;
    this.program = new Command();
    this.loadCommands();

    const jsonParser = new JsonElectronConfigParser();
    const yamlParser = new YamlElectronConfigParser();

    const mainBuilder = new EsbuildMainBuilder(loaders, logger);
    const preloadBuilder = new EsbuildPreloadBuilder(loaders, logger);
    const rendererBuilder = new EsbuildRendererBuilder(loaders, logger);
    const buildService = new EsbuildElectronBuildService(mainBuilder, preloadBuilder, rendererBuilder, logger);
    const developService = new EsbuildElectronDevelopService(mainBuilder, preloadBuilder, rendererBuilder, logger);

    this.jsonEsbuildDev = new DevApplication(jsonParser, developService, logger);
    this.jsonEsbuildBuild = new BuildApplication(jsonParser, buildService, logger);

    this.yamlEsbuildDev = new DevApplication(yamlParser, developService, logger);
    this.yamlEsbuildBuild = new BuildApplication(yamlParser, buildService, logger);
  }

  private loadCommands(): void {
    this.program
      .name('electron-esbuild')
      .description('CLI for building Electron apps with esbuild')
      .version(this.packageJson.version);
    const commandDevelopment = this.program.command('dev');
    const commandBuild = this.program.command('build');

    commandDevelopment
      .description('Starts the development server')
      .option('-c, --config <path>', 'Path to the config file')
      .option('--clean', 'Clean the output directory')
      .action((options: DevOptions) => {
        process.env.NODE_ENV = 'development';

        (async () => {
          try {
            const pathConfig = this.prepareConfigPath(options.config);
            const extension = path.extname(pathConfig);

            switch (extension) {
              case '.json':
                this.jsonEsbuildDev.dev(pathConfig, options.clean || false);
                break;
              case '.yml':
              case '.yaml':
                this.yamlEsbuildDev.dev(pathConfig, options.clean || false);
                break;
              default:
                this.logger.warn('CLI', 'Config file not supported');
            }
          } catch (error: any) {
            this.logger.error('CLI', error.message);
          }
        })();
      });

    commandBuild
      .description('Builds the application')
      .option('-c, --config <path>', 'Path to the config file')
      .action((options: BuildOptions) => {
        process.env.NODE_ENV = 'production';

        (async () => {
          try {
            const pathConfig = this.prepareConfigPath(options.config);
            const extension = path.extname(pathConfig);

            switch (extension) {
              case '.json':
                await this.jsonEsbuildBuild.build(pathConfig, true);
                break;
              case '.yml':
              case '.yaml':
                await this.yamlEsbuildBuild.build(pathConfig, true);
                break;
              default:
                this.logger.warn('CLI', 'Config file not supported');
            }
          } catch (error: any) {
            this.logger.error('CLI', error.message);
          }
        })();
      });
  }

  private prepareConfigPath(config: string | undefined): string {
    const jsonConfig = 'electron-esbuild.configon';
    const yamlConfig = 'electron-esbuild.config.yaml';
    let pathConfig: string;

    if (config) {
      pathConfig = path.resolve(process.cwd(), config);

      if (!fs.existsSync(pathConfig)) {
        throw new Error('Config file not found');
      }

      return pathConfig;
    }

    pathConfig = path.resolve(process.cwd(), yamlConfig);

    if (fs.existsSync(path.resolve(process.cwd(), yamlConfig))) {
      this.logger.info('CLI', 'Using default config file: electron-esbuild.config.yaml');
      return pathConfig;
    }

    if (fs.existsSync(path.resolve(process.cwd(), jsonConfig))) {
      this.logger.info('CLI', 'Using default config file: electron-esbuild.configon');
      return path.resolve(process.cwd(), jsonConfig);
    }

    throw new Error('Config file not found');
  }

  public parse(argv: string[]): void {
    this.program.parse(argv);
  }
}
