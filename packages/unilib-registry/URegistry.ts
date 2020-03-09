/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from 'unilib-error';
import IRegistry from './IRegistry';

export namespace URegistry {
  export interface Initializer {
    (registry?: URegistry): NonNullable<any>;
  }
}

export class URegistry implements IRegistry {
  private readonly __: {
    [key: string]: {
      value?: NonNullable<any>;
      initializer?: URegistry.Initializer;
    };
  } = {};

  public set(key: string, value: NonNullable<any>): void {
    if (typeof key !== 'string' || key.trim() === '') {
      throw new UError(`${this.constructor.name}.set/INVALID_KEY`, {
        context: { key }
      });
    }

    if (value === undefined || value === null) {
      throw new UError(`${this.constructor.name}.set/INVALID_VALUE`, {
        context: { value }
      });
    }

    this.__[key] = { value };
  }

  public register(key: string, initializer: URegistry.Initializer): void {
    if (typeof key !== 'string' || key.trim() === '') {
      throw new UError(`${this.constructor.name}.register/INVALID_KEY`, {
        context: { key }
      });
    }

    if (typeof initializer !== 'function') {
      throw new UError(
        `${this.constructor.name}.register/INVALID_VALUE_INITIALIZER`,
        { context: { initializer } }
      );
    }

    this.__[key] = { initializer };
  }

  public isRegistered(key: string): boolean {
    return typeof key === 'string' ? Boolean(this.__[key]) : false;
  }

  public get(key: string, defaultValue?: NonNullable<any>): NonNullable<any> {
    try {
      if (typeof key !== 'string' || key.trim() === '') {
        throw new UError(`${this.constructor.name}.get/INVALID_KEY`, {
          context: { key }
        });
      }

      if (!this.isRegistered(key)) {
        if (defaultValue !== undefined && defaultValue !== null) {
          return defaultValue;
        }

        throw new UError(`${this.constructor.name}.get/UNREGISTERED_KEY`, {
          context: { key }
        });
      }

      if (this.__[key].initializer) {
        const initializer = this.__[key].initializer as URegistry.Initializer;

        const value = initializer(this);

        if (value === undefined || value === null) {
          throw new UError(
            `${this.constructor.name}.get/INVALID_VALUE_INITIALIZED`
          );
        }

        delete this.__[key].initializer;
        this.__[key].value = value;
      }

      return this.__[key].value;
    } catch (error) {
      if (error.message.startsWith(`${this.constructor.name}.get`)) throw error;

      throw new UError(`${this.constructor.name}.get/UNEXPECTED`, {
        cause: error
      });
    }
  }
}

export default URegistry;
