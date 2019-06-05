/* eslint-disable @typescript-eslint/no-explicit-any */

import { ulid } from 'ulid';

export interface UErrorInterface extends Error {
  readonly id: string;
  readonly timestamp: number;
  readonly context: { [key: string]: NonNullable<any> };
}

export class UError extends Error implements UErrorInterface {
  public readonly id: string = ulid();
  public readonly timestamp: number = Date.now();
  public readonly context: { [key: string]: NonNullable<any> } = {};

  public constructor(
    message?: string,
    context?: { [key: string]: NonNullable<any> }
  ) {
    super(typeof message === 'string' ? message : '');
    if (typeof context === 'object') this.context = context;
  }
}

export default UError;
