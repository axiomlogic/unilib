/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace UError {
  export interface Properties {
    [key: string]: NonNullable<any>;
  }
}

export class UError extends Error {
  [key: string]: NonNullable<any>;

  public constructor(message?: string, properties?: UError.Properties) {
    super(typeof message === 'string' ? message : '');

    if (typeof properties === 'object') {
      for (const key in properties) {
        if (properties[key] === undefined || properties[key] === null) continue;
        this[key] = properties[key];
      }
    }
  }
}

export default UError;
