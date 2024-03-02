export interface Logger {
  log(scope: string, message: string): void;

  error(scope: string, message: string): void;

  warn(scope: string, message: string): void;

  info(scope: string, message: string): void;

  debug(scope: string, message: string): void;
}
