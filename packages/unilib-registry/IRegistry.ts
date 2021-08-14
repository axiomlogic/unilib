/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IRegistry {
  get<T = NonNullable<any>>(key: string, defaultValue?: T): T;
}

export const IRegistry = {
  name: 'IRegistry'
};

export default IRegistry;
