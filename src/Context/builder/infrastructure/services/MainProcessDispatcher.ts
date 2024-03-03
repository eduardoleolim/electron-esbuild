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

  constructor(logger: Logger) {
    this.logger = logger;
    this.isWindows = process.platform === 'win32';
    this.electronBin = this.isWindows ? 'electron.cmd' : 'electron';
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
        electronProcess.removeAllListeners('close');

        return new Promise((resolve, reject) => {
          if (this.isWindows) {
            this.logger.info('MAIN-PROCESS', 'kill electron process on windows');
            const killProcess = spawn('taskkill', ['/pid', `${electronProcess.pid}`, '/f', '/t']);

            killProcess.on('close', () => {
              resolve();
            });

            killProcess.on('error', (error) => {
              reject(error);
            });
          } else {
            this.logger.info('MAIN-PROCESS', 'kill electron process on macOS/linux');

            electronProcess.on('close', () => {
              resolve();
            });

            electronProcess.on('error', (error) => {
              reject(error);
            });

            electronProcess.kill();
          }
        });
      },
    };
  }
}
