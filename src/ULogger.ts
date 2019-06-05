/* eslint-disable @typescript-eslint/no-explicit-any */

type Appender = (
  level: string,
  record: NonNullable<any>
) => void | Promise<void>;

export interface ULoggerInterface {
  log(level: number, record: NonNullable<any>): void;
}

const levels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

const LEVEL_TRACE = 0;
const LEVEL_DEBUG = 1;
const LEVEL_INFO = 2;
const LEVEL_WARN = 3;
const LEVEL_ERROR = 4;
const LEVEL_SILENT = 5;

export class ULogger {
  public static readonly LEVEL_TRACE = LEVEL_TRACE;
  public static readonly LEVEL_DEBUG = LEVEL_DEBUG;
  public static readonly LEVEL_INFO = LEVEL_INFO;
  public static readonly LEVEL_WARN = LEVEL_WARN;
  public static readonly LEVEL_ERROR = LEVEL_ERROR;
  public static readonly LEVEL_SILENT = LEVEL_SILENT;

  private _level = LEVEL_SILENT;
  private _appender: Appender = (): void => {};

  public constructor(
    level: number,
    appender: (level: string, record: NonNullable<any>) => void | Promise<void>
  ) {
    this.setLevel(level);
    if (typeof appender === 'function') this._appender = appender;
  }

  public setLevel(level: number): void {
    if (typeof level === 'number' && levels[level]) this._level = level;
  }

  public log(level: number, record: NonNullable<any>): void {
    if (
      this._level === LEVEL_SILENT ||
      !levels[level] ||
      level < this._level ||
      record === undefined ||
      record === null
    ) {
      return;
    }

    const wrapper = async (level: number, record: any): Promise<any> => {
      try {
        await this._appender(levels[level], record);
      } catch (error) {}
    };

    wrapper(level, record);
  }
}

export default ULogger;
