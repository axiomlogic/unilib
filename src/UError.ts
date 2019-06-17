/* eslint-disable @typescript-eslint/no-explicit-any */

import { ulid } from 'ulid';

export namespace UError {
  export interface Context {
    [key: string]: NonNullable<any>;
  }
}

export class UError extends Error {
  public readonly id: string = ulid();
  public readonly timestamp: number = Date.now();
  public readonly context: UError.Context = {};

  public constructor(message?: string, context?: UError.Context) {
    super(typeof message === 'string' ? message : '');
    if (typeof context === 'object') this.context = context;
  }
}

export default UError;
