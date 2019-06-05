import UError from './UError';

describe(
  UError.name,
  (): void => {
    let error;

    describe('constructor', (): void => {
      it('constructs instance, given no arguments', (): void => {
        error = new UError();
        expect(error.message).toEqual('');
        expect(error.id).toEqual(expect.any(String));
        expect(error.id.length).toBeGreaterThan(0);
        expect(error.timestamp).toEqual(expect.any(Number));
        expect(error.timestamp).toBeLessThanOrEqual(Date.now());
        expect(error.context).toEqual({});
      });

      it('constructs instance, given valid message', (): void => {
        error = new UError('foobar');
        expect(error.message).toEqual('foobar');
        expect(error.id).toEqual(expect.any(String));
        expect(error.id.length).toBeGreaterThan(0);
        expect(error.timestamp).toEqual(expect.any(Number));
        expect(error.timestamp).toBeLessThanOrEqual(Date.now());
        expect(error.context).toEqual({});
      });

      it('constructs instance, given valid message and context', (): void => {
        error = new UError('foobar', { foo: 'bar' });
        expect(error.message).toEqual('foobar');
        expect(error.id).toEqual(expect.any(String));
        expect(error.id.length).toBeGreaterThan(0);
        expect(error.timestamp).toEqual(expect.any(Number));
        expect(error.timestamp).toBeLessThanOrEqual(Date.now());
        expect(error.context).toEqual({ foo: 'bar' });
      });
    });
  }
);
