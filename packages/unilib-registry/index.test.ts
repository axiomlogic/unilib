/* eslint-disable @typescript-eslint/no-var-requires */

import URegistry, { URegistry as URegistry2 } from './index';
const { default: URegistry3, URegistry: URegistry4 } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    const registry: URegistry = new URegistry();
    expect(registry).toBeInstanceOf(URegistry);
    expect(URegistry).toBe(URegistry2);
    expect(URegistry).toBe(URegistry3);
    expect(URegistry).toBe(URegistry4);
  });
});
