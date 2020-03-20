/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export enum LogLevel {
  SILENT = 'SILENT',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export const LEVEL_SILENT = LogLevel.SILENT;
export const LEVEL_TRACE = LogLevel.TRACE;
export const LEVEL_DEBUG = LogLevel.DEBUG;
export const LEVEL_INFO = LogLevel.INFO;
export const LEVEL_WARN = LogLevel.WARN;
export const LEVEL_ERROR = LogLevel.ERROR;

export interface ILogger<T = NonNullable<any>> {
  log(level: LogLevel, record: T): void;
}

export const ILogger = {
  name: 'ILogger',
  LEVEL_SILENT,
  LEVEL_TRACE,
  LEVEL_DEBUG,
  LEVEL_INFO,
  LEVEL_WARN,
  LEVEL_ERROR
};

export default ILogger;
