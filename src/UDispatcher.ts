/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from './UError';

export namespace UDispatcher {
  export interface Handler {
    (...parameters: NonNullable<any>[]): any | Promise<any>;
  }
}

export class UDispatcher {
  private readonly __: {
    [topic: string]: UDispatcher.Handler;
  } = {};

  public register(name: string, handler: UDispatcher.Handler): void {
    if (typeof name !== 'string' || (name = name.trim()) === '') {
      throw new UError(
        `${this.constructor.name}.register/INVALID_HANDLER_NAME`,
        { context: { name } }
      );
    }

    if (typeof handler !== 'function') {
      throw new UError(`${this.constructor.name}.register/INVALID_HANDLER`, {
        context: { handler }
      });
    }

    this.__[name] = handler;
  }

  public isRegistered(name: string): boolean {
    return Boolean(this.__[name]);
  }

  public async dispatch(
    name: string,
    ...parameters: NonNullable<any>
  ): Promise<any> {
    if (typeof name !== 'string' || (name = name.trim()) === '') {
      throw new UError(
        `${this.constructor.name}.dispatch/INVALID_HANDLER_NAME`,
        { context: { name } }
      );
    }

    if (!this.isRegistered(name)) {
      throw new UError(
        `${this.constructor.name}.dispatch/UNREGISTERED_HANDLER_NAME`,
        { context: { name } }
      );
    }

    return this.__[name](...parameters);
  }
}

export default UDispatcher;
