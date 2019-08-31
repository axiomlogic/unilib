/* eslint-disable @typescript-eslint/no-var-requires */

import UBus from 'unilib-bus';
import UDispatcher from 'unilib-dispatcher';
import UError from 'unilib-error';
import ULogger from 'unilib-logger';
import URegistry from 'unilib-registry';
import Unilib, { UBus as UBus2, UDispatcher as UDispatcher2, UError as UError2, ULogger as ULogger2, URegistry as URegistry2 } from './index';
const { default: Unilib2, UBus: UBus3, UDispatcher: UDispatcher3, UError: UError3, ULogger: ULogger3, URegistry: URegistry3 } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    expect(Unilib).toBe(Unilib2);

    const error: UError2 = new UError();
    expect(error).toBeInstanceOf(UError2);
    expect(UError).toBe(UError2);
    expect(UError).toBe(UError3);
    expect(UError).toBe(Unilib.UError);

    const dispatcher: UDispatcher2 = new UDispatcher();
    expect(dispatcher).toBeInstanceOf(UDispatcher2);
    expect(UDispatcher).toBe(UDispatcher2);
    expect(UDispatcher).toBe(UDispatcher3);
    expect(UDispatcher).toBe(Unilib.UDispatcher);

    const registry: URegistry2 = new URegistry();
    expect(registry).toBeInstanceOf(URegistry2);
    expect(URegistry).toBe(URegistry2);
    expect(URegistry).toBe(URegistry3);
    expect(URegistry).toBe(Unilib.URegistry);

    const logger: ULogger2 = new ULogger(ULogger.LEVEL_SILENT, (): void => {});
    expect(logger).toBeInstanceOf(ULogger2);
    expect(ULogger).toBe(ULogger2);
    expect(ULogger).toBe(ULogger3);
    expect(ULogger).toBe(Unilib.ULogger);

    const bus: UBus2 = new UBus();
    expect(bus).toBeInstanceOf(UBus2);
    expect(UBus).toBe(UBus2);
    expect(UBus).toBe(UBus3);
    expect(UBus).toBe(Unilib.UBus);
  });
});
