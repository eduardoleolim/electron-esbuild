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
        const pathConfig = options.config || 'electron-esbuild.config.json';
        const fullConfigPath = path.resolve(process.cwd(), pathConfig);

        const extension = path.extname(fullConfigPath);

        try {
          switch (extension) {
            case '.json':
              jsonDevEsbuild.dev(fullConfigPath, options.clean || false);
              break;
            case '.yml':
            case '.yaml':
              yamlDevEsbuild.dev(fullConfigPath, options.clean || false);
              break;
            default:
              throw new Error('Config file not supported');
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
        const pathConfig = options.config || 'electron-esbuild.config.json';
        const fullConfigPath = path.resolve(process.cwd(), pathConfig);

        const extension = path.extname(fullConfigPath);

        try {
          switch (extension) {
            case '.json':
              jsonBuildEsbuild.build(fullConfigPath, true);
              break;
            case '.yml':
            case '.yaml':
              yamlBuildEsbuild.build(fullConfigPath, true);
              break;
            default:
              throw new Error('Config file not supported');
          }
        } catch (error: any) {
          console.log(error.message);
        }
      });
  }

  public parse(argv: string[]): void {
    this.program.parse(argv);
  }
}
