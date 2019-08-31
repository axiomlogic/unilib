/* eslint-disable @typescript-eslint/no-var-requires */

import UDispatcher, { UDispatcher as UDispatcher2 } from './index';
const { default: UDispatcher3, UDispatcher: UDispatcher4 } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    const dispatcher: UDispatcher = new UDispatcher();
    expect(dispatcher).toBeInstanceOf(UDispatcher);
    expect(UDispatcher).toBe(UDispatcher2);
    expect(UDispatcher).toBe(UDispatcher3);
    expect(UDispatcher).toBe(UDispatcher4);
  });
});
