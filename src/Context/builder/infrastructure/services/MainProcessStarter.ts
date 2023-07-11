import { MainConfig } from '../../../config/domain/MainConfig';
import { ChildProcess, spawn } from 'child_process';
import path from 'path';

export class MainProcessStarter {
  private readonly mainConfig: MainConfig;
  private readonly outputDirectory: string;
  private mainProcess?: ChildProcess;
  private readonly isWindows: boolean;
  private readonly electronBin: string;

  constructor(mainConfig: MainConfig, outputDirectory: string) {
    this.mainConfig = mainConfig;
    this.outputDirectory = outputDirectory;
    this.isWindows = process.platform === 'win32';
    this.electronBin = this.isWindows ? 'electron.cmd' : 'electron';
    this.cleanupProcess();
  }

  async start() {
    if (this.mainProcess !== undefined) {
      try {
        this.kill();
      } catch (e) {
        console.error('Error while killing main process', e);
      }
    }

    const filePath = path.resolve(
      this.outputDirectory,
      this.mainConfig.output.directory,
      this.mainConfig.output.filename,
    );

    console.log('Starting main process');

    this.mainProcess = spawn(path.resolve(`node_modules/.bin/${this.electronBin}`), [filePath], {
      stdio: 'inherit',
    });

    this.configCleanup();
  }

  private kill() {
    if (this.mainProcess) {
      this.mainProcess.removeAllListeners('close');

      if (this.isWindows) {
        console.debug('kill electron process on windows');

        spawn('taskkill', ['/pid', `${this.mainProcess.pid}`, '/f', '/t']);
      } else {
        console.debug('kill electron process on macOS/linux');
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
        console.error('Main Process exited with signal', signal);
        process.exit(1);
      }

      process.exit(code);
    });
  }

  private cleanupProcess() {
    const clean = (signal: NodeJS.Signals) => {
      process.on(signal, () => {
        console.log('Cleanup before exit...');
        console.debug('Signal', signal);

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
