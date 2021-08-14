/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace IBus {
  export interface UnsubscribeCallback {
    (): void;
  }

  export interface Subscriber<T = any> {
    (topic: string, message: T): void | Promise<void>;
  }
}

export interface IBus {
  subscribe<T = any>(
    topic: string,
    subscriber: IBus.Subscriber<T>
  ): IBus.UnsubscribeCallback;

  publish<T = any>(topic: string, message: T): void;
}

export const IBus = {
  name: 'IBus'
};

export default IBus;
