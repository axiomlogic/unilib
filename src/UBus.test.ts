/* eslint-disable @typescript-eslint/no-explicit-any */

import defer from 'lodash.defer';
import UBus from './UBus';
import UError from './UError';

type Subscriber = (topic: string, message?: NonNullable<any>) => void | Promise<void>;

describe(
  UBus.name,
  (): void => {
    let bus: UBus;

    beforeEach(
      (): void => {
        bus = new UBus();
      }
    );

    describe('subscribe', (): void => {
      it('subscribes to topic, given valid topic and subscriber', (done): void => {
        const subscriber1 = jest.fn();
        bus.subscribe('foobar', subscriber1);

        const subscriber2 = jest.fn().mockResolvedValue(undefined);
        bus.subscribe('foobar', subscriber2);

        bus.publish('foobar', {});

        defer((): void => {
          expect(subscriber1).toHaveBeenCalledTimes(1);
          expect(subscriber2).toHaveBeenCalledTimes(1);
          done();
        }, 10);
      });

      it('subscribes to topic(s), given valid wildcard topic and subscriber', (done): void => {
        const subscriber1 = jest.fn();
        bus.subscribe('foobar/*', subscriber1);

        const subscriber2 = jest.fn();
        bus.subscribe('foobar/2', subscriber2);

        bus.publish('foobar/1');

        bus.publish('foobar/2');

        defer((): void => {
          expect(subscriber1).toHaveBeenCalledTimes(2);
          expect(subscriber2).toHaveBeenCalledTimes(1);
          done();
        }, 10);
      });

      it('subscribes only once, given same topic and subscriber pair', (done): void => {
        const subscriber = jest.fn();
        bus.subscribe('foobar', subscriber);
        bus.subscribe('foobar', subscriber);

        bus.publish('foobar');

        defer((): void => {
          expect(subscriber).toHaveBeenCalledTimes(1);
          done();
        }, 10);
      });

      it('returns an unsubscribe function, given valid topic and subscriber', (done): void => {
        const subscriber = jest.fn();

        const unsubscribe = bus.subscribe('foobar', subscriber);

        bus.publish('foobar');

        unsubscribe();

        bus.publish('foobar');

        defer((): void => {
          expect(subscriber).toHaveBeenCalledTimes(1);
          done();
        }, 10);
      });

      it('throws error, given invalid topic', (): void => {
        try {
          bus.subscribe('', (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.subscribe/INVALID_TOPIC`);
        }

        try {
          bus.subscribe(({} as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.subscribe/INVALID_TOPIC`);
        }

        try {
          bus.subscribe((undefined as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.subscribe/INVALID_TOPIC`);
        }

        try {
          bus.subscribe((null as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.subscribe/INVALID_TOPIC`);
        }
      });

      it('throws error, given invalid subscriber', (): void => {
        try {
          bus.subscribe('foobar', ({} as unknown) as () => void);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.subscribe/INVALID_SUBSCRIBER`);
        }

        try {
          bus.subscribe('foobar', (undefined as unknown) as () => void);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.subscribe/INVALID_SUBSCRIBER`);
        }

        try {
          bus.subscribe('foobar', (null as unknown) as () => void);
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.subscribe/INVALID_SUBSCRIBER`);
        }
      });
    });

    describe('publish', (): void => {
      it('publishes message, given valid topic and message', (done): void => {
        const subscriber = jest.fn().mockImplementation(
          (topic, message): void => {
            try {
              expect(topic).toMatch(/foobar\/\d+/);

              const suffix = topic.slice(-1);

              switch (suffix) {
                case '0':
                  expect(message).toEqual('');
                  break;
                case '1':
                  expect(message).toEqual({});
                  break;
                case '2':
                  expect(message).toEqual('xyz');
                  break;
                case '3':
                  expect(message).toEqual(123);
                  break;
                case '4':
                  expect(message).toEqual({});
                  break;
                default:
                  break;
              }
            } catch (error) {
              fail(error);
            }
          }
        );

        bus.subscribe('foobar/*', subscriber);

        bus.publish('foobar/0');

        bus.publish('foobar/1', {});

        bus.publish('foobar/2', 'xyz');

        bus.publish('foobar/3', 123);

        defer((): void => {
          expect(subscriber).toHaveBeenNthCalledWith(1, 'foobar/0', '');
          expect(subscriber).toHaveBeenNthCalledWith(2, 'foobar/1', {});
          expect(subscriber).toHaveBeenNthCalledWith(3, 'foobar/2', 'xyz');
          expect(subscriber).toHaveBeenNthCalledWith(4, 'foobar/3', 123);
          done();
        }, 10);
      });

      it('throws error, given invalid topic', (): void => {
        try {
          bus.publish('', (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.publish/INVALID_TOPIC`);
        }

        try {
          bus.publish('foobar*', (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.publish/INVALID_TOPIC`);
        }

        try {
          bus.publish(({} as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.publish/INVALID_TOPIC`);
        }

        try {
          bus.publish((undefined as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.publish/INVALID_TOPIC`);
        }

        try {
          bus.publish((null as unknown) as string, (): void => {});
          fail(new Error('Unexpected'));
        } catch (error) {
          expect(error).toBeInstanceOf(UError);
          expect(error.message).toMatch(`${UBus.name}.publish/INVALID_TOPIC`);
        }
      });
    });
  }
);
