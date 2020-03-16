/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ILogger<T = NonNullable<any>> {
  log(level: string, record: T): void;
}

export default ILogger;
