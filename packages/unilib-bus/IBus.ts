/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace IBus {
  export interface UnsubscribeCallback {
    (): void;
  }

  export interface Subscriber {
    (topic: string, message?: NonNullable<any>): void | Promise<void>;
  }
}

export interface IBus {
  subscribe(
    topic: string,
    subscriber: IBus.Subscriber
  ): IBus.UnsubscribeCallback;

  publish(topic: string, message?: NonNullable<any>): void;
}

export default IBus;
