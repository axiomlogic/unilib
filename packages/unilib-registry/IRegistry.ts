/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IRegistry {
  get<T = NonNullable<any>>(key: string, defaultValue?: T): T;
}

export default IRegistry;
