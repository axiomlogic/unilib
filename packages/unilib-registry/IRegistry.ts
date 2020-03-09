/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IRegistry {
  get(key: string, defaultValue?: NonNullable<any>): NonNullable<any>;
}

export default IRegistry;
