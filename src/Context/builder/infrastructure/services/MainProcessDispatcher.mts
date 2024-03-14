import { ChildProcess, spawn } from 'child_process';
import * as path from 'path';

import { MainConfig } from '../../../config/domain/MainConfig.mjs';
import { Logger } from '../../../shared/domain/Logger.mjs';

export interface MainProcess {
  process: ChildProcess;
  kill: () => Promise<void>;
}

export class MainProcessDispatcher {
  private readonly logger: Logger;
  private readonly isWindows: boolean;
  private readonly electronBin: string;
  private readonly mainProcessQueue: MainProcess[];
  private requestForFinish;

  constructor(logger: Logger) {
    this.logger = logger;
    this.isWindows = process.platform === 'win32';
    this.electronBin = this.isWindows ? 'electron.cmd' : 'electron';
    this.mainProcessQueue = [];
    this.requestForFinish = false;
    this.initProcessKiller();
    process.on('SIGINT', async () => {
      this.requestForFinish = true;
    });
  }

  dispatchProcess(output: string, config: MainConfig): MainProcess {
    const entryPath = path.resolve(output, config.output.directory, config.output.filename);
    const electronPath = path.resolve(`node_modules/.bin/${this.electronBin}`);

    this.logger.log('MAIN-PROCESS', 'Starting main process');

    const electronProcess = spawn(electronPath, [entryPath], { stdio: 'inherit' }).on('close', (code, signal) => {
      if (code === null) {
        this.logger.error('MAIN-PROCESS', `Main Process exited with signal ${signal}`);
        process.exit(1);
      }

      this.logger.info('MAIN-PROCESS', `Main Process exited with code ${code}`);
      process.exit(code);
    });

    return {
      process: electronProcess,
      kill: () => {
        return new Promise((resolve, reject) => {
          const onKillComplete = () => {
            resolve();
            this.logger.info('MAIN-PROCESS', `Main Process with pid ${electronProcess.pid} killed`);
          };

          electronProcess.removeAllListeners('close');

          if (this.isWindows) {
            this.killProcessWindows(electronProcess, onKillComplete, reject);
          } else {
            this.killProcessMacOSLinux(electronProcess, onKillComplete, reject);
          }
        });
      },
    };
  }

  private async initProcessKiller(): Promise<void> {
    setInterval(() => {
      if (this.mainProcessQueue.length > 0 || this.requestForFinish === false) {
        const process = this.mainProcessQueue.pop();
        if (process !== undefined) {
          process.kill();
        }
      }
    }, 1000);
  }

  killProcess(process: MainProcess): void {
    this.mainProcessQueue.push(process);
  }

  private killProcessWindows(process: ChildProcess, onKillComplete: () => void, onError: (error: Error) => void): void {
    const killProcess = spawn('taskkill', ['/pid', `${process.pid}`, '/f', '/t']);

    killProcess.on('close', onKillComplete);
    killProcess.on('error', onError);
  }

  private killProcessMacOSLinux(
    process: ChildProcess,
    onKillComplete: () => void,
    onError: (error: Error) => void,
  ): void {
    process.on('close', onKillComplete);
    process.on('error', onError);

    process.kill();
  }
}
