import { Command } from 'commander';
import path from 'path';
import * as fs from 'fs';
import { devEsbuild } from '../builders/Builders';

type DevOptions = {
  config?: string;
};

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
      .action((options: DevOptions) => {
        process.env.NODE_ENV = 'development';
        const pathConfig = options.config || 'electron-esbuild.config.json';
        const fullConfigPath = path.resolve(process.cwd(), pathConfig);

        try {
          devEsbuild.dev(fullConfigPath);
        } catch (error: any) {
          console.log(error.message);
        }
      });

    commandBuild
      .description('Builds the application')
      .option('-c, --config <path>', 'Path to the config file')
      .action((options) => {
        process.env.NODE_ENV = 'production';
        const pathConfig = options.config || 'electron-esbuild.config.json';
        const fullConfigPath = path.resolve(process.cwd(), pathConfig);
      });
  }

  public parse(argv: string[]): void {
    this.program.parse(argv);
  }
}
