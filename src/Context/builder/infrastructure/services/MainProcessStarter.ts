import { MainConfig } from '../../../config/domain/MainConfig';
import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { Logger } from '../../../shared/domain/Logger';

export class MainProcessStarter {
  private readonly mainConfig: MainConfig;
  private readonly outputDirectory: string;
  private mainProcess?: ChildProcess;
  private readonly isWindows: boolean;
  private readonly electronBin: string;
  private readonly logger: Logger;

  constructor(mainConfig: MainConfig, outputDirectory: string, logger: Logger) {
    this.mainConfig = mainConfig;
    this.outputDirectory = outputDirectory;
    this.isWindows = process.platform === 'win32';
    this.electronBin = this.isWindows ? 'electron.cmd' : 'electron';
    this.logger = logger;
    this.cleanupProcess();
  }

  async start() {
    if (this.mainProcess !== undefined) {
      try {
        this.kill();
      } catch (error: any) {
        this.logger.error('MAIN', error.message);
      }
    }

    const filePath = path.resolve(
      this.outputDirectory,
      this.mainConfig.output.directory,
      this.mainConfig.output.filename,
    );

    this.logger.log('MAIN', 'Starting main process');

    this.mainProcess = spawn(path.resolve(`node_modules/.bin/${this.electronBin}`), [filePath], {
      stdio: 'inherit',
    });

    this.configCleanup();
  }

  private kill() {
    if (this.mainProcess) {
      this.mainProcess.removeAllListeners('close');

      if (this.isWindows) {
        this.logger.debug('MAIN', 'kill electron process on windows');

        spawn('taskkill', ['/pid', `${this.mainProcess.pid}`, '/f', '/t']);
      } else {
        this.logger.debug('MAIN', 'kill electron process on macOS/linux');
        const pid = this.mainProcess.pid;
        const killed = this.mainProcess.killed;
        this.mainProcess = undefined;

        if (pid !== undefined && !killed) {
          process.kill(pid);
        }
      }
    }
  }

  private configCleanup() {
    this.mainProcess?.on('close', (code, signal) => {
      if (code === null) {
        this.logger.error('MAIN', `Main Process exited with signal ${signal}`);
        process.exit(1);
      }

      this.logger.info('MAIN', `Main Process exited with code ${code}`);
      process.exit(code);
    });
  }

  private cleanupProcess() {
    const clean = (signal: NodeJS.Signals) => {
      process.on(signal, () => {
        this.logger.log('MAIN', `Cleanup before exit`);
        this.logger.debug('MAIN', `Signal ${signal}`);

        if (!this.mainProcess?.killed ?? false) {
          this.kill();
        }

        process.exit(0);
      });
    };

    clean('SIGINT');
    clean('SIGTERM');
  }
}
