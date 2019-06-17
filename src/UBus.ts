/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from './UError';

const WILDCARD = '*';

export namespace UBus {
  export interface Subscriber {
    (topic: string, message?: NonNullable<any>): void | Promise<void>;
  }
}

export class UBus {
  private readonly __: {
    [topic: string]: UBus.Subscriber[];
  } = {};

  public subscribe(topic: string, subscriber: UBus.Subscriber): () => void {
    if (typeof topic !== 'string' || (topic = topic.trim()) === '') {
      throw new UError(`${this.constructor.name}.subscribe/INVALID_TOPIC`, {
        topic
      });
    }

    if (typeof subscriber !== 'function') {
      throw new UError(
        `${this.constructor.name}.subscribe/INVALID_SUBSCRIBER`,
        { subscriber }
      );
    }

    if (!this.__[topic]) this.__[topic] = [];

    const unsubscribe = (): void => {
      this.__[topic] = this.__[topic].filter(
        (s: UBus.Subscriber): boolean => s !== subscriber
      );
    };

    if (
      !this.__[topic].some((s: UBus.Subscriber): boolean => s === subscriber)
    ) {
      this.__[topic] = [...this.__[topic], subscriber];
    }

    return unsubscribe;
  }

  public publish(topic: string, message?: NonNullable<any>): void {
    if (
      typeof topic !== 'string' ||
      (topic = topic.trim()) === '' ||
      topic.endsWith(WILDCARD)
    ) {
      throw new UError(`${this.constructor.name}.publish/INVALID_TOPIC`, {
        topic
      });
    }

    let subscribers: UBus.Subscriber[] = [];

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
      (subscriber: UBus.Subscriber): Wrapper => async (): Promise<void> => {
        try {
          await subscriber(
            topic,
            message === undefined || message === null ? '' : message
          );
        } catch (error) {}
      }
    );

    for (const wrapper of wrappers) {
      wrapper();
    }
  }
}

export default UBus;
