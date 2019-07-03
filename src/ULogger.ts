/* eslint-disable @typescript-eslint/no-explicit-any */

import registry from './registry';
import UError from './UError';

export namespace ULogger {
  export interface Appender {
    (level: string, record: NonNullable<any>): void | Promise<void>;
  }
}

const LEVEL_SILENT = 'SILENT';
const LEVEL_TRACE = 'TRACE';
const LEVEL_DEBUG = 'DEBUG';
const LEVEL_INFO = 'INFO';
const LEVEL_WARN = 'WARN';
const LEVEL_ERROR = 'ERROR';

const levels: { [key: string]: number } = {
  [LEVEL_SILENT]: -1,
  [LEVEL_TRACE]: 0,
  [LEVEL_DEBUG]: 1,
  [LEVEL_INFO]: 2,
  [LEVEL_WARN]: 3,
  [LEVEL_ERROR]: 4
};

export class ULogger {
  public static readonly LEVEL_SILENT = LEVEL_SILENT;
  public static readonly LEVEL_TRACE = LEVEL_TRACE;
  public static readonly LEVEL_DEBUG = LEVEL_DEBUG;
  public static readonly LEVEL_INFO = LEVEL_INFO;
  public static readonly LEVEL_WARN = LEVEL_WARN;
  public static readonly LEVEL_ERROR = LEVEL_ERROR;

  private _level: string;
  private readonly _appender: ULogger.Appender | undefined;

  public constructor(level: string, appender?: ULogger.Appender) {
    if (
      typeof level !== 'string' ||
      typeof levels[(level = level.trim().toUpperCase())] !== 'number'
    ) {
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
    this._appender = appender;
  }

  public getLevel(): string {
    return this._level;
  }

  public setLevel(level: string): void {
    if (
      typeof level !== 'string' ||
      typeof levels[(level = level.trim().toUpperCase())] !== 'number'
    ) {
      throw new UError(`${this.constructor.name}.setLevel/INVALID_LEVEL`, {
        context: { level }
      });
    }

    this._level = level;
  }

  public log(level: string, record: NonNullable<any>): void {
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

    const appender = this._appender as ULogger.Appender;

    const wrapper = async (
      level: string,
      record: NonNullable<any>
    ): Promise<any> => {
      try {
        await appender(level, record);
      } catch (error) {}
    };

    wrapper(level, record);
  }

  public static getLogger(...names: string[]): ULogger {
    for (const name of names) {
      if (!registry.isRegistered(name)) continue;
      const logger = registry.get(name);
      if (logger instanceof ULogger) return logger;
    }
    return new ULogger(LEVEL_SILENT);
  }
}

export default ULogger;
