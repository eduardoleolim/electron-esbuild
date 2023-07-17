import { Command } from 'commander';
import path from 'path';
import * as fs from 'fs';
import { jsonBuildEsbuild, jsonDevEsbuild, yamlBuildEsbuild, yamlDevEsbuild } from '../builders/Builders';

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

  constructor() {
    this.packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8'));
    this.program = new Command();
    this.program
      .name('electron-esbuild')
      .description('CLI for building Electron apps with esbuild')
      .version(this.packageJson.version);

    this.loadCommands();
  }

  private loadCommands(): void {
    const commandDevelopment = this.program.command('dev');
    const commandBuild = this.program.command('build');

    commandDevelopment
      .description('Starts the development server')
      .option('-c, --config <path>', 'Path to the config file')
      .option('--clean', 'Clean the output directory')
      .action((options: DevOptions) => {
        process.env.NODE_ENV = 'development';

        try {
          const pathConfig = this.prepareConfigPath(options.config);
          const extension = path.extname(pathConfig);

          switch (extension) {
            case '.json':
              jsonDevEsbuild.dev(pathConfig, options.clean || false);
              break;
            case '.yml':
            case '.yaml':
              yamlDevEsbuild.dev(pathConfig, options.clean || false);
              break;
            default:
              console.log('Config file not supported');
          }
        } catch (error: any) {
          console.log(error.message);
        }
      });

    commandBuild
      .description('Builds the application')
      .option('-c, --config <path>', 'Path to the config file')
      .action((options: BuildOptions) => {
        process.env.NODE_ENV = 'production';
        try {
          const pathConfig = this.prepareConfigPath(options.config);
          const extension = path.extname(pathConfig);

          switch (extension) {
            case '.json':
              jsonBuildEsbuild.build(pathConfig, true);
              break;
            case '.yml':
            case '.yaml':
              yamlBuildEsbuild.build(pathConfig, true);
              break;
            default:
              console.log('Config file not supported');
          }
        } catch (error: any) {
          console.log(error.message);
        }
      });
  }

  private prepareConfigPath(config: string | undefined): string {
    const jsonConfig = 'electron-esbuild.config.json';
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
      console.log('Using default config file: electron-esbuild.config.yaml');
      return pathConfig;
    }

    if (fs.existsSync(path.resolve(process.cwd(), jsonConfig))) {
      console.log('Using default config file: electron-esbuild.config.json');
      return path.resolve(process.cwd(), jsonConfig);
    }

    throw new Error('Config file not found');
  }

  public parse(argv: string[]): void {
    this.program.parse(argv);
  }
}
