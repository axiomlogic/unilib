/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IDispatcher {
  dispatch<T = any>(name: string, ...parameters: any[]): Promise<T>;
}

export const IDispatcher = {
  name: 'IDispatcher'
};

export default IDispatcher;
