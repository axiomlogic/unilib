/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from './UError';
import URegistry from './URegistry';

class TestService {}

describe(URegistry.name, (): void => {
  let registry: URegistry;

  beforeEach((): void => {
    registry = new URegistry();
  });

  describe('isRegistered', (): void => {
    it('returns true, given key is registered', (): void => {
      registry.set('someString', 'foobar');
      expect(registry.isRegistered('someString'));
    });

    it('returns false, given key is not registered', (): void => {
      expect(!registry.isRegistered('someString'));
      expect(!registry.isRegistered(({} as unknown) as string));
    });
  });

  describe('set', (): void => {
    it('sets value, given valid key and value', (): void => {
      registry.set('someString', 'foobar');
      expect(registry.isRegistered('someString'));

      registry.set('someNumber', 1234);
      expect(registry.isRegistered('someNumber'));

      registry.set('someBoolean', true);
      expect(registry.isRegistered('someBoolean'));

      registry.set('someArray', []);
      expect(registry.isRegistered('someArray'));

      registry.set('someObject', {});
      expect(registry.isRegistered('someObject'));

      registry.set('someService', new TestService());
      expect(registry.isRegistered('someService'));
    });

    it('throws error, given invalid key', (): void => {
      try {
        registry.set('', 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toMatch(`${URegistry.name}.set/INVALID_KEY`);
      }

      try {
        registry.set(({} as unknown) as string, 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.set/INVALID_KEY`);
      }

      try {
        registry.set((undefined as unknown) as string, 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.set/INVALID_KEY`);
      }

      try {
        registry.set((null as unknown) as string, 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.set/INVALID_KEY`);
      }
    });

    it('throws error, given invalid value', (): void => {
      try {
        registry.set('someString', null);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.set/INVALID_VALUE`);
      }

      try {
        registry.set('someString', undefined);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.set/INVALID_VALUE`);
      }
    });
  });

  describe('register', (): void => {
    it('registers value initializer, given valid key and value initializer', (): void => {
      registry.register('someObject', (): object => ({}));
      expect(registry.isRegistered('someObject'));

      registry.register('someService', (): TestService => new TestService());
      expect(registry.isRegistered('someService'));
    });

    it('throws error, given invalid key', (): void => {
      try {
        registry.register('', (): string => 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toMatch(`${URegistry.name}.register/INVALID_KEY`);
      }

      try {
        registry.register(({} as unknown) as string, (): string => 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.register/INVALID_KEY`);
      }

      try {
        registry.register((undefined as unknown) as string, (): string => 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.register/INVALID_KEY`);
      }

      try {
        registry.register((null as unknown) as string, (): string => 'foobar');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.register/INVALID_KEY`);
      }
    });

    it('throws error, given invalid value initializer', (): void => {
      try {
        registry.register('someService', ('foobar' as unknown) as URegistry.Initializer);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.register/INVALID_VALUE_INITIALIZER`);
      }

      try {
        registry.register('someService', (undefined as unknown) as URegistry.Initializer);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.register/INVALID_VALUE_INITIALIZER`);
      }

      try {
        registry.register('someService', (null as unknown) as URegistry.Initializer);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.register/INVALID_VALUE_INITIALIZER`);
      }
    });
  });

  describe('get', (): void => {
    it('returns registered value, given valid key', (): void => {
      const someString = 'foobar';
      registry.set('someString', someString);
      expect(registry.get('someString')).toBe(someString);

      const someNumber = 1234;
      registry.set('someNumber', someNumber);
      expect(registry.get('someNumber')).toBe(someNumber);

      const someBoolean = true;
      registry.set('someBoolean', someBoolean);
      expect(registry.get('someBoolean')).toBe(someBoolean);

      const someArray: any[] = [];
      registry.set('someArray', someArray);
      expect(registry.get('someArray')).toBe(someArray);

      const someObject = {};
      registry.set('someObject1', someObject);
      expect(registry.get('someObject1')).toBe(someObject);

      registry.register('someObject2', (): object => ({}));
      expect(registry.get('someObject2')).toBe(registry.get('someObject2'));

      const someService1 = new TestService();
      registry.set('someService1', someService1);
      expect(registry.get('someService1')).toBe(someService1);

      registry.register('someService2', (): TestService => new TestService());
      expect(registry.get('someService2')).toBe(registry.get('someService2'));
    });

    it('returns specified default value, given key not registered', (): void => {
      expect(registry.get('someString', 'foobar')).toEqual('foobar');
    });

    it('throws error, given invalid key', (): void => {
      try {
        registry.get('');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toMatch(`${URegistry.name}.get/INVALID_KEY`);
      }

      try {
        registry.get(({} as unknown) as string);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.get/INVALID_KEY`);
      }

      try {
        registry.get((undefined as unknown) as string);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.get/INVALID_KEY`);
      }

      try {
        registry.get((null as unknown) as string);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.get/INVALID_KEY`);
      }
    });

    it('throws error, given key is not registered and no default value provided', (): void => {
      try {
        registry.get('someString');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.get/UNREGISTERED_KEY`);
      }
    });

    it('throws error, given badly implemented value initializer', (): void => {
      registry.register('someService', (): void => {
        new TestService();
      });

      try {
        registry.get('someService');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.get/INVALID_VALUE_INITIALIZED`);
      }

      registry.register('someService', (): void => {
        throw Error('foobar');
      });

      try {
        registry.get('someService');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${URegistry.name}.get/UNEXPECTED`);
        expect(error.cause).toBeInstanceOf(Error);
        expect(error.cause.message).toEqual('foobar');
      }
    });
  });
});
