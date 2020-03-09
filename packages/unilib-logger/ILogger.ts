/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ILogger {
  log(level: string, record: NonNullable<any>): void;
}

export default ILogger;
