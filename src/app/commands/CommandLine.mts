import { Command } from 'commander';
import * as fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { BuildApplication } from '../../Context/builder/application/BuildApplication.mjs';
import { DevApplication } from '../../Context/builder/application/DevApplication.mjs';
import { RendererProcessBuilderService } from '../../Context/builder/domain/RendererProcessBuilderService.mjs';
import { EsbuildMainProcessBuilder } from '../../Context/builder/infrastructure/services/EsbuildMainProcessBuilder.mjs';
import { EsbuildPreloadBuilder } from '../../Context/builder/infrastructure/services/EsbuildPreloadBuilder.mjs';
import { EsbuildRendererProcessBuilder } from '../../Context/builder/infrastructure/services/EsbuildRendererProcessBuilder.mjs';
import { ViteRendererProcessBuilder } from '../../Context/builder/infrastructure/services/ViteRendererProcessBuilder.mjs';
import { ConfigParser } from '../../Context/config/domain/ConfigParser.mjs';
import { JsonElectronConfigParser } from '../../Context/config/infrastructure/JsonElectronConfigParser.mjs';
import { YamlElectronConfigParser } from '../../Context/config/infrastructure/YamlElectronConfigParser.mjs';
import { Logger } from '../../Context/shared/domain/Logger.mjs';
import { loaders } from '../../Context/shared/infrastructure/esbuidLoaders.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PackageJson {
  version: string;
}

interface Options {
  config?: string;
  vite?: boolean;
}

type DevOptions = Options & {
  clean?: boolean;
};

type BuildOptions = Options;

export class CommandLine {
  private readonly program: Command;
  private readonly packageJson: PackageJson;
  private readonly jsonParser: JsonElectronConfigParser;
  private readonly yamlParser: YamlElectronConfigParser;
  private readonly esbuildMainBuilder: EsbuildMainProcessBuilder;
  private readonly esbuildRendererBuilder: EsbuildRendererProcessBuilder;
  private readonly esbuildPreloadBuilder: EsbuildPreloadBuilder;
  private readonly viteRendererBuilder: ViteRendererProcessBuilder;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8'));
    this.logger = logger;
    this.jsonParser = new JsonElectronConfigParser();
    this.yamlParser = new YamlElectronConfigParser();

    this.esbuildMainBuilder = new EsbuildMainProcessBuilder(loaders, logger);
    this.esbuildPreloadBuilder = new EsbuildPreloadBuilder(loaders, logger);
    this.esbuildRendererBuilder = new EsbuildRendererProcessBuilder(loaders, logger);
    this.viteRendererBuilder = new ViteRendererProcessBuilder(logger);
    this.program = new Command();
    this.loadCommands();
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
      .option('--vite', 'Use Vite for renderer process')
      .action((options: DevOptions) => {
        process.env.NODE_ENV = 'development';
        (async () => {
          try {
            let isUsingVite;
            const clean = options.clean || false;
            const pathConfig = this.prepareConfigPath(options.config);
            const extension = path.extname(pathConfig);
            let parser: ConfigParser;
            let rendererBuilder: RendererProcessBuilderService;

            if (extension === '.json') {
              parser = this.jsonParser;
            } else if (extension === '.yml' || extension === '.yaml') {
              parser = this.yamlParser;
            } else {
              throw new Error('Config file not supported');
            }

            if (options.vite) {
              rendererBuilder = this.viteRendererBuilder;
              isUsingVite = true;
            } else {
              rendererBuilder = this.esbuildRendererBuilder;
              isUsingVite = false;
            }

            const devApplication = new DevApplication(
              parser,
              this.esbuildMainBuilder,
              rendererBuilder,
              this.esbuildPreloadBuilder,
              this.logger
            );
            await devApplication.develop(pathConfig, clean, isUsingVite);
          } catch (error: unknown) {
            if (error instanceof Error) {
              this.logger.error('CLI', error.message);
            } else {
              this.logger.error('CLI', 'An error occurred');
            }
          }
        })();
      });

    commandBuild
      .description('Builds the application')
      .option('-c, --config <path>', 'Path to the config file')
      .option('--vite', 'Use Vite for renderer process')
      .action((options: BuildOptions) => {
        process.env.NODE_ENV = 'production';
        (async () => {
          try {
            let isUsingVite;
            const pathConfig = this.prepareConfigPath(options.config);
            const extension = path.extname(pathConfig);
            let parser: ConfigParser;
            let rendererBuilder: RendererProcessBuilderService;

            if (extension === '.json') {
              parser = this.jsonParser;
            } else if (extension === '.yml' || extension === '.yaml') {
              parser = this.yamlParser;
            } else {
              throw new Error('Config file not supported');
            }

            if (options.vite) {
              rendererBuilder = this.viteRendererBuilder;
              isUsingVite = true;
            } else {
              rendererBuilder = this.esbuildRendererBuilder;
              isUsingVite = false;
            }

            const buildApplication = new BuildApplication(
              parser,
              this.esbuildMainBuilder,
              rendererBuilder,
              this.esbuildPreloadBuilder,
              this.logger
            );
            await buildApplication.build(pathConfig, true, isUsingVite);
          } catch (error: unknown) {
            if (error instanceof Error) {
              this.logger.error('CLI', error.message);
            } else {
              this.logger.error('CLI', 'An error occurred');
            }
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
