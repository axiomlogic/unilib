import UError from './UError';

describe(UError.name, (): void => {
  let error;

  describe('constructor', (): void => {
    it('constructs instance, given no arguments', (): void => {
      error = new UError();
      expect(error.message).toEqual('');
    });

    it('constructs instance, given valid message', (): void => {
      error = new UError('foobar');
      expect(error.message).toEqual('foobar');
    });

    it('constructs instance, given valid message and properties', (): void => {
      error = new UError('foobar', {
        a: 'A',
        b: 'B',
        c: undefined,
        d: null,
        e: { value: 'E' }
      });
      expect(error.message).toEqual('foobar');
      expect(error.a).toEqual('A');
      expect(error.b).toEqual('B');
      expect(error.c).toBeUndefined();
      expect(error.d).toBeUndefined();
      expect(error.e).toBeDefined();
      expect(error.e.value).toEqual('E');
    });
  });
});
