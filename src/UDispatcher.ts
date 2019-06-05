/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from './UError';

export interface UDispatcherInterface {
  dispatch(name: string, ...parameters: NonNullable<any>[]): Promise<any>;
}

type Handler = (...parameters: NonNullable<any>[]) => any | Promise<any>;

export class UDispatcher implements UDispatcherInterface {
  private readonly __: {
    [topic: string]: Handler;
  } = {};

  public register(
    name: string,
    handler: (...parameters: NonNullable<any>[]) => any | Promise<any>
  ): void {
    if (typeof name !== 'string' || (name = name.trim()) === '') {
      throw new UError(
        `${this.constructor.name}.register/INVALID_HANDLER_NAME`,
        { name }
      );
    }

    if (typeof handler !== 'function') {
      throw new UError(`${this.constructor.name}.register/INVALID_HANDLER`, {
        handler
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
        { name }
      );
    }

    if (!this.isRegistered(name)) {
      throw new UError(
        `${this.constructor.name}.dispatch/UNREGISTERED_HANDLER_NAME`,
        { name }
      );
    }

    return this.__[name](...parameters);
  }
}

export default UDispatcher;
