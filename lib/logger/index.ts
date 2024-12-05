export interface Logger {
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
}

export const logger: Logger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
};