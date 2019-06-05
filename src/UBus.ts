/* eslint-disable @typescript-eslint/no-explicit-any */

import UError from './UError';

const WILDCARD = '*';

export interface UBusInterface {
  subscribe(
    topic: string,
    subscriber: (
      topic: string,
      message?: NonNullable<any>
    ) => void | Promise<void>
  ): () => void;

  publish(topic: string, message?: NonNullable<any>): void;
}

type Subscriber = (
  topic: string,
  message?: NonNullable<any>
) => void | Promise<void>;

export class UBus implements UBusInterface {
  private readonly __: {
    [topic: string]: Subscriber[];
  } = {};

  public subscribe(
    topic: string,
    subscriber: (
      topic: string,
      message?: NonNullable<any>
    ) => void | Promise<void>
  ): () => void {
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
        (s: Subscriber): boolean => s !== subscriber
      );
    };

    if (!this.__[topic].some((s: Subscriber): boolean => s === subscriber)) {
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

    let subscribers: Subscriber[] = [];

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
      (subscriber: Subscriber): Wrapper => async (): Promise<void> => {
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
