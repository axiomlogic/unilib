/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from 'unilib-error';
import IRegistry from './IRegistry';

export namespace URegistry {
  export interface Initializer<T = NonNullable<any>> {
    (registry?: URegistry): T;
  }
}

interface URegistryEntry<T = NonNullable<any>> {
  value: T;
  initializer?: URegistry.Initializer<T>;
}

export class URegistry implements IRegistry {
  private readonly __: {
    [key: string]: URegistryEntry;
  } = {};

  public set<T = NonNullable<any>>(key: string, value: T): void {
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

  public register<T = NonNullable<any>>(
    key: string,
    initializer: URegistry.Initializer<T>
  ): void {
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

    this.__[key] = { initializer, value: Infinity };
  }

  public isRegistered(key: string): boolean {
    return typeof key === 'string' ? Boolean(this.__[key]) : false;
  }

  public get<T = NonNullable<any>>(key: string, defaultValue?: T): T {
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

      const entry = this.__[key] as URegistryEntry<T>;

      if (entry.initializer) {
        const value = entry.initializer(this);

        if (value === undefined || value === null) {
          throw new UError(
            `${this.constructor.name}.get/INVALID_VALUE_INITIALIZED`
          );
        }

        delete entry.initializer;
        entry.value = value;
      }

      return entry.value;
    } catch (error) {
      if (error.message.startsWith(`${this.constructor.name}.get`)) throw error;

      throw new UError(`${this.constructor.name}.get/UNEXPECTED`, {
        cause: error
      });
    }
  }
}

export default URegistry;
