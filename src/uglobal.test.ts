import uglobal from './uglobal';
import URegistry from './URegistry';

describe('uglobal', (): void => {
  it('is an instance of URegistry when imported', (): void => {
    expect(uglobal).toBeInstanceOf(URegistry);
    expect(uglobal.get('foo', 'bar')).toEqual('bar');
  });
});
