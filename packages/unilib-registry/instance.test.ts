import registry from './instance';
import URegistry from './URegistry';

describe('instance', (): void => {
  it('is an instance of URegistry', (): void => {
    expect(registry).toBeInstanceOf(URegistry);
  });
});
