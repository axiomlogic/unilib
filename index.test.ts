/* eslint-disable @typescript-eslint/no-var-requires */

import UBus from 'unilib-bus';
import UError from 'unilib-error';
import ULogger from 'unilib-logger';
import URegistry from 'unilib-registry';
import { UBus as UBus2, UError as UError2, ULogger as ULogger2, URegistry as URegistry2 } from './index';

const { UBus: UBus3, UError: UError3, ULogger: ULogger3, URegistry: URegistry3 } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    expect(UError).toBe(UError2);
    expect(UError).toBe(UError3);

    expect(URegistry).toBe(URegistry2);
    expect(URegistry).toBe(URegistry3);

    expect(ULogger).toBe(ULogger2);
    expect(ULogger).toBe(ULogger3);

    expect(UBus).toBe(UBus2);
    expect(UBus).toBe(UBus3);
  });
});
