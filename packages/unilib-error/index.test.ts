/* eslint-disable @typescript-eslint/no-var-requires */

import UError, { UError as UError2 } from './index';
const { default: UError3, UError: UError4 } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    expect(UError).toBe(UError2);
    expect(UError).toBe(UError3);
    expect(UError).toBe(UError4);
  });
});
