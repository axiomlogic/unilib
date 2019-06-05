/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from './UError';
import UDispatcher from './UDispatcher';

const idle = async (ms: number): Promise<void> => {
  return new Promise(
    (resolve): void => {
      const t = setTimeout((): void => {
        clearTimeout(t);
        resolve();
      }, ms);
    }
  );
};

type Handler = (...parameters: NonNullable<any>[]) => any | Promise<any>;

describe(
  UDispatcher.name,
  (): void => {
    let dispatcher: UDispatcher;

    beforeEach(
      (): void => {
        dispatcher = new UDispatcher();
      }
    );

    describe('register', (): void => {
      it('registers handler, given valid name and handler', (): void => {
        dispatcher.register('foobar', (): void => {});

        expect(dispatcher.isRegistered('foobar'));
      });

      it('throws error, given invalid name', (): void => {
        try {
          dispatcher.register('', (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER_NAME`));
        }

        try {
          dispatcher.register(({} as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER_NAME`));
        }

        try {
          dispatcher.register((undefined as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER_NAME`));
        }

        try {
          dispatcher.register((null as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER_NAME`));
        }
      });

      it('throws error, given invalid handler', (): void => {
        try {
          dispatcher.register('foobar', ('' as unknown) as Handler);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER`));
        }

        try {
          dispatcher.register('foobar', ({} as unknown) as Handler);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER`));
        }

        try {
          dispatcher.register('foobar', (undefined as unknown) as Handler);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER`));
        }

        try {
          dispatcher.register('foobar', (null as unknown) as Handler);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.register/INVALID_HANDLER`));
        }
      });
    });

    describe('dispatch', (): void => {
      it('dispatches to handler, given registered name', async (): Promise<void> => {
        dispatcher.register('foobar', (x, y, z): string => `${x}:${y}:${z}`);

        expect(await dispatcher.dispatch('foobar', 1, 2, 3)).toBe('1:2:3');

        dispatcher.register(
          'foobar',
          async (x): Promise<string> => {
            await idle(10);
            return `${x}:${x}:${x}`;
          }
        );

        expect(await dispatcher.dispatch('foobar', 1)).toBe('1:1:1');

        dispatcher.register('foobar', (): number => 0);

        expect(await dispatcher.dispatch('foobar')).toBe(0);
      });

      it('throws error, given invalid name', async (): Promise<void> => {
        try {
          await dispatcher.dispatch('');
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.dispatch/INVALID_HANDLER_NAME`));
        }

        try {
          await dispatcher.dispatch(({} as unknown) as string);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.dispatch/INVALID_HANDLER_NAME`));
        }

        try {
          await dispatcher.dispatch((undefined as unknown) as string);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.dispatch/INVALID_HANDLER_NAME`));
        }

        try {
          await dispatcher.dispatch((null as unknown) as string);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.dispatch/INVALID_HANDLER_NAME`));
        }
      });

      it('throws error, given unregistered name', async (): Promise<void> => {
        try {
          await dispatcher.dispatch('foobar');
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(new RegExp(`^${UDispatcher.name}.dispatch/UNREGISTERED_HANDLER_NAME`));
        }
      });
    });
  }
);
