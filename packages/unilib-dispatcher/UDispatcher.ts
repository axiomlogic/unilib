/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from 'unilib-error';
import IDispatcher from './IDispatcher';

const WILDCARD = '*';

export namespace UDispatcher {
  export interface Handler<S = any, T = any> {
    (...parameters: S[]): T | Promise<T>;
  }
}

export class UDispatcher implements IDispatcher {
  private readonly __: {
    [name: string]: UDispatcher.Handler;
  } = {};

  public register<S = any, T = any>(
    name: string,
    handler: UDispatcher.Handler<S, T>
  ): void {
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

  public canDispatch(name: string): boolean {
    return Boolean(this._getHandler(name));
  }

  private _getHandler<S = any, T = any>(
    name: string
  ): UDispatcher.Handler<S, T> | undefined {
    for (const _name of Object.keys(this.__)) {
      if (
        _name === name ||
        (_name.endsWith(WILDCARD) && name.startsWith(_name.slice(0, -1)))
      ) {
        return this.__[_name];
      }
    }
  }

  public async dispatch<S = any, T = any>(
    name: string,
    ...parameters: S[]
  ): Promise<T> {
    if (
      typeof name !== 'string' ||
      (name = name.trim()) === '' ||
      name.endsWith(WILDCARD)
    ) {
      throw new UError(
        `${this.constructor.name}.dispatch/INVALID_HANDLER_NAME`,
        { context: { name } }
      );
    }

    const handler = this._getHandler<S, T>(name);

    if (!handler) {
      throw new UError(
        `${this.constructor.name}.dispatch/UNREGISTERED_HANDLER`,
        { context: { name } }
      );
    }

    return handler(...parameters);
  }
}

export default UDispatcher;
