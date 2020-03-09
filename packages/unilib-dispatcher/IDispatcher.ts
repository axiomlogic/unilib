/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IDispatcher {
  dispatch(name: string, ...parameters: any[]): Promise<any>;
}

export default IDispatcher;
