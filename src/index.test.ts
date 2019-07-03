/* eslint-disable @typescript-eslint/no-var-requires */

import { default as defaultFromImport, registry as registryFromImport, URegistry as URegistryFromImport } from './index';

const { default: defaultFromRequire, registry: registryFromRequire, URegistry: URegistryFromRequire } = require('./index');

describe('index', (): void => {
  it('exports', (): void => {
    expect(defaultFromImport).toBe(defaultFromRequire);
    expect(registryFromImport).toBe(registryFromRequire);
    expect(URegistryFromImport).toBe(URegistryFromRequire);
  });
});
