/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IDispatcher {
  dispatch<S = any, T = any>(name: string, ...parameters: S[]): Promise<T>;
}

export default IDispatcher;
