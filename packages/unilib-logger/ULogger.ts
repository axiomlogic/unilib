/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from 'unilib-error';
import ILogger, {
  LEVEL_DEBUG,
  LEVEL_ERROR,
  LEVEL_INFO,
  LEVEL_SILENT,
  LEVEL_TRACE,
  LEVEL_WARN,
  LogLevel
} from './ILogger';

export namespace ULogger {
  export interface Appender<T = NonNullable<any>> {
    (level: LogLevel, record: T): void | Promise<void>;
  }
}

const levels: { [key: string]: number } = {
  [LEVEL_SILENT]: -1,
  [LEVEL_TRACE]: 0,
  [LEVEL_DEBUG]: 1,
  [LEVEL_INFO]: 2,
  [LEVEL_WARN]: 3,
  [LEVEL_ERROR]: 4
};

export class ULogger<T = NonNullable<any>> implements ILogger<T> {
  public static readonly LEVEL_SILENT = LEVEL_SILENT;
  public static readonly LEVEL_TRACE = LEVEL_TRACE;
  public static readonly LEVEL_DEBUG = LEVEL_DEBUG;
  public static readonly LEVEL_INFO = LEVEL_INFO;
  public static readonly LEVEL_WARN = LEVEL_WARN;
  public static readonly LEVEL_ERROR = LEVEL_ERROR;

  private _level: LogLevel;
  private readonly _appender: ULogger.Appender = () => {};

  public constructor(level: LogLevel, appender?: ULogger.Appender<T>) {
    if (typeof level !== 'string' || typeof levels[level] !== 'number') {
      throw new UError(`${this.constructor.name}.constructor/INVALID_LEVEL`, {
        context: { level }
      });
    }

    if (appender !== undefined && typeof appender !== 'function') {
      throw new UError(
        `${this.constructor.name}.constructor/INVALID_APPENDER`,
        { context: { appender } }
      );
    }

    this._level = level;
    if (appender) this._appender = appender;
  }

  public getLevel(): LogLevel {
    return this._level;
  }

  public setLevel(level: LogLevel): void {
    if (typeof level !== 'string' || typeof levels[level] !== 'number') {
      throw new UError(`${this.constructor.name}.setLevel/INVALID_LEVEL`, {
        context: { level }
      });
    }

    this._level = level;
  }

  public log(level: LogLevel, record: T): void {
    if (
      this._level === LEVEL_SILENT ||
      level === LEVEL_SILENT ||
      typeof levels[level] !== 'number' ||
      levels[level] < levels[this._level] ||
      record === undefined ||
      record === null
    ) {
      return;
    }

    const wrapper = async (level: LogLevel, record: T): Promise<void> => {
      try {
        await this._appender(level, record);
      } catch (error) {
        void error;
      }
    };

    wrapper(level, record);
  }
}

export default ULogger;
