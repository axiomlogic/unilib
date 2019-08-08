/* eslint-disable @typescript-eslint/no-var-requires */

import UBus, { UBus as UBus2 } from './index';
const { default: UBus3, UBus: UBus4 } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    expect(UBus).toBe(UBus2);
    expect(UBus).toBe(UBus3);
    expect(UBus).toBe(UBus4);
  });
});
