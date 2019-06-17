/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace ULogger {
  export interface Appender {
    (level: string, record: NonNullable<any>): void | Promise<void>;
  }
}

const LEVEL_SILENT = -1;
const LEVEL_SILENT_LABEL = 'SILENT';
const LEVEL_TRACE = 0;
const LEVEL_TRACE_LABEL = 'TRACE';
const LEVEL_DEBUG = 1;
const LEVEL_DEBUG_LABEL = 'DEBUG';
const LEVEL_INFO = 2;
const LEVEL_INFO_LABEL = 'INFO';
const LEVEL_WARN = 3;
const LEVEL_WARN_LABEL = 'WARN';
const LEVEL_ERROR = 4;
const LEVEL_ERROR_LABEL = 'ERROR';

const levels = [
  LEVEL_TRACE_LABEL,
  LEVEL_DEBUG_LABEL,
  LEVEL_INFO_LABEL,
  LEVEL_WARN_LABEL,
  LEVEL_ERROR_LABEL
];

function toLevel(level: number | string): number {
  if (typeof level === 'number' && levels[level]) return level;
  if (typeof level === 'string') {
    const i = levels.indexOf(level.trim().toUpperCase());
    return i >= 0 ? i : LEVEL_SILENT;
  }
  return LEVEL_SILENT;
}

export class ULogger {
  public static readonly LEVEL_SILENT = LEVEL_SILENT;
  public static readonly LEVEL_SILENT_LABEL = LEVEL_SILENT_LABEL;
  public static readonly LEVEL_TRACE = LEVEL_TRACE;
  public static readonly LEVEL_TRACE_LABEL = LEVEL_TRACE_LABEL;
  public static readonly LEVEL_DEBUG = LEVEL_DEBUG;
  public static readonly LEVEL_DEBUG_LABEL = LEVEL_DEBUG_LABEL;
  public static readonly LEVEL_INFO = LEVEL_INFO;
  public static readonly LEVEL_INFO_LABEL = LEVEL_INFO_LABEL;
  public static readonly LEVEL_WARN = LEVEL_WARN;
  public static readonly LEVEL_WARN_LABEL = LEVEL_WARN_LABEL;
  public static readonly LEVEL_ERROR = LEVEL_ERROR;
  public static readonly LEVEL_ERROR_LABEL = LEVEL_ERROR_LABEL;

  private _level = LEVEL_SILENT;
  private _appender: ULogger.Appender = (): void => {};

  public constructor(level: number | string, appender: ULogger.Appender) {
    this.setLevel(level);
    if (typeof appender === 'function') this._appender = appender;
  }

  public setLevel(level: number | string): void {
    this._level = toLevel(level);
    return;
  }

  public log(level: number, record: NonNullable<any>): void {
    if (
      this._level === LEVEL_SILENT ||
      level === LEVEL_SILENT ||
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
