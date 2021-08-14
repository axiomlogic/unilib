/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from 'unilib-error';
import IBus from './IBus';

const WILDCARD = '*';

export class UBus implements IBus {
  private readonly __: {
    [topic: string]: IBus.Subscriber[];
  } = {};

  public subscribe<T = any>(
    topic: string,
    subscriber: IBus.Subscriber<T>
  ): IBus.UnsubscribeCallback {
    if (typeof topic !== 'string' || (topic = topic.trim()) === '') {
      throw new UError(`${this.constructor.name}.subscribe/INVALID_TOPIC`, {
        context: { topic }
      });
    }

    if (typeof subscriber !== 'function') {
      throw new UError(
        `${this.constructor.name}.subscribe/INVALID_SUBSCRIBER`,
        { context: { subscriber } }
      );
    }

    if (!this.__[topic]) this.__[topic] = [];

    const unsubscribe = (): void => {
      this.__[topic] = this.__[topic].filter(
        (s: IBus.Subscriber): boolean => s !== subscriber
      );
    };

    if (
      !this.__[topic].some((s: IBus.Subscriber): boolean => s === subscriber)
    ) {
      this.__[topic] = [...this.__[topic], subscriber];
    }

    return unsubscribe;
  }

  public publish<T = any>(topic: string, message: T): void {
    if (
      typeof topic !== 'string' ||
      (topic = topic.trim()) === '' ||
      topic.endsWith(WILDCARD)
    ) {
      throw new UError(`${this.constructor.name}.publish/INVALID_TOPIC`, {
        context: { topic }
      });
    }

    let subscribers: IBus.Subscriber<T>[] = [];

    for (const _topic of Object.keys(this.__)) {
      if (
        _topic === topic ||
        (_topic.endsWith(WILDCARD) && topic.startsWith(_topic.slice(0, -1)))
      ) {
        subscribers = subscribers.concat(this.__[_topic]);
      }
    }

    type Wrapper = () => Promise<void>;

    const wrappers = subscribers.map(
      (subscriber: IBus.Subscriber<T>): Wrapper =>
        async (): Promise<void> => {
          try {
            await subscriber(topic, message);
          } catch (error) {
            void error;
          }
        }
    );

    for (const wrapper of wrappers) {
      wrapper();
    }
  }
}

export default UBus;
