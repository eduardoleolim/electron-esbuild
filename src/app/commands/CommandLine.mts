import { Command } from 'commander';
import * as fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { BuildApplication } from '../../Context/builder/application/BuildApplication.mjs';
import { DevApplication } from '../../Context/builder/application/DevApplication.mjs';
import { EsbuildMainProcessBuilder } from '../../Context/builder/infrastructure/services/EsbuildMainProcessBuilder.mjs';
import { EsbuildPreloadBuilder } from '../../Context/builder/infrastructure/services/EsbuildPreloadBuilder.mjs';
import { EsbuildRendererProcessBuilder } from '../../Context/builder/infrastructure/services/EsbuildRendererProcessBuilder.mjs';
import { JsonElectronConfigParser } from '../../Context/config/infrastructure/JsonElectronConfigParser.mjs';
import { YamlElectronConfigParser } from '../../Context/config/infrastructure/YamlElectronConfigParser.mjs';
import { Logger } from '../../Context/shared/domain/Logger.mjs';
import { loaders } from '../../Context/shared/infrastructure/esbuidLoaders.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    const mainBuilder = new EsbuildMainProcessBuilder(loaders, logger);
    const preloadBuilder = new EsbuildPreloadBuilder(loaders, logger);
    const rendererBuilder = new EsbuildRendererProcessBuilder(loaders, logger);

    this.jsonEsbuildDev = new DevApplication(jsonParser, mainBuilder, rendererBuilder, preloadBuilder, logger);
    this.jsonEsbuildBuild = new BuildApplication(jsonParser, mainBuilder, rendererBuilder, preloadBuilder, logger);

    this.yamlEsbuildDev = new DevApplication(yamlParser, mainBuilder, rendererBuilder, preloadBuilder, logger);
    this.yamlEsbuildBuild = new BuildApplication(yamlParser, mainBuilder, rendererBuilder, preloadBuilder, logger);
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
                this.jsonEsbuildDev.develop(pathConfig, options.clean || false);
                break;
              case '.yml':
              case '.yaml':
                this.yamlEsbuildDev.develop(pathConfig, options.clean || false);
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
