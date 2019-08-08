/* eslint-disable @typescript-eslint/no-var-requires */

import ULogger, { ULogger as ULogger2 } from './index';
const { default: ULogger3, ULogger: ULogger4 } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    expect(ULogger).toBe(ULogger2);
    expect(ULogger).toBe(ULogger3);
    expect(ULogger).toBe(ULogger4);
  });
});
