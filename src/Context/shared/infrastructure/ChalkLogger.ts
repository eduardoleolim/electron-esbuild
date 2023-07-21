import chalk from 'chalk';

import { Logger } from '../domain/Logger.js';

export class ChalkLogger implements Logger {
  beginTime: Date;

  constructor(beginTime: Date) {
    this.beginTime = beginTime;
  }

  private getTime(): string {
    const time = Date.now() - this.beginTime.getTime();
    const seconds = Math.floor(time / 1000);
    const milliseconds = (time % 1000).toString().padStart(3, '0');
    return `${seconds}.${milliseconds}`;
  }

  public debug(scope: string, message: string): void {
    console.debug(chalk.gray(`[${this.getTime()}] ${scope.trim().toUpperCase()}: ${message}`));
  }

  public error(scope: string, message: string): void {
    console.error(chalk.red(`[${this.getTime()}] ${scope.trim().toUpperCase()}: ${message}`));
  }

  public info(scope: string, message: string): void {
    console.info(chalk.blue(`[${this.getTime()}] ${scope.trim().toUpperCase()}: ${message}`));
  }

  public log(scope: string, message: string): void {
    console.log(chalk.white(`[${this.getTime()}] ${scope.trim().toUpperCase()}: ${message}`));
  }

  public warn(scope: string, message: string): void {
    console.warn(chalk.yellow(`[${this.getTime()}] ${scope.trim().toUpperCase()}: ${message}`));
  }
}
