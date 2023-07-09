import { Command } from 'commander';
import path from 'path';
import * as fs from 'fs';

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
        const pathConfig = options.config || 'electron-esbuild.config.json';
        const fullConfigPath = path.resolve(process.cwd(), pathConfig);
      });

    commandBuild
      .description('Builds the application')
      .option('-c, --config <path>', 'Path to the config file')
      .action((options) => {
        const pathConfig = options.config || 'electron-esbuild.config.json';
        const fullConfigPath = path.resolve(process.cwd(), pathConfig);
      });
  }

  public parse(argv: string[]): void {
    this.program.parse(argv);
  }
}
