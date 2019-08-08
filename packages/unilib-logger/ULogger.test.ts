/* eslint-disable @typescript-eslint/no-explicit-any */

import defer from 'lodash.defer';
import UError from 'unilib-error';
import ULogger from './ULogger';

describe(ULogger.name, (): void => {
  let logger: ULogger;
  let appender: ULogger.Appender;

  beforeEach((): void => {
    appender = jest.fn();
  });

  describe('constructor', (): void => {
    it('constructs instance, given valid level and appender', (done): void => {
      logger = new ULogger(ULogger.LEVEL_TRACE, appender);
      logger.log(ULogger.LEVEL_TRACE, {});

      logger = new ULogger(ULogger.LEVEL_TRACE.toLowerCase(), appender);
      logger.log(ULogger.LEVEL_TRACE, {});

      defer((): void => {
        expect(appender).toHaveBeenCalledTimes(2);
        done();
      }, 10);
    });

    it('throws, given invalid level', (): void => {
      try {
        logger = new ULogger('', appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger((123 as unknown) as string, appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger((undefined as unknown) as string, appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger((null as unknown) as string, appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }
    });

    it('throws, given invalid appender', (): void => {
      try {
        logger = new ULogger(ULogger.LEVEL_TRACE, ('' as unknown) as ULogger.Appender);
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_APPENDER`);
      }

      try {
        logger = new ULogger(ULogger.LEVEL_TRACE, (undefined as unknown) as ULogger.Appender);
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_APPENDER`);
      }

      try {
        logger = new ULogger(ULogger.LEVEL_TRACE, (null as unknown) as ULogger.Appender);
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_APPENDER`);
      }
    });
  });

  describe('getLevel', (): void => {
    it('returns current level, given no arguments', (): void => {
      logger = new ULogger(ULogger.LEVEL_TRACE, appender);
      expect(logger.getLevel()).toEqual(ULogger.LEVEL_TRACE);
    });
  });

  describe('setLevel', (): void => {
    it('sets new level, given valid level', (): void => {
      logger = new ULogger(ULogger.LEVEL_TRACE, appender);
      logger.setLevel(ULogger.LEVEL_DEBUG);
      expect(logger.getLevel()).toEqual(ULogger.LEVEL_DEBUG);
    });

    it('throws, given an invalid level', (): void => {
      try {
        logger = new ULogger(ULogger.LEVEL_TRACE, appender);
        logger.setLevel('');
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.setLevel/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger(ULogger.LEVEL_TRACE, appender);
        logger.setLevel((undefined as unknown) as string);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.setLevel/INVALID_LEVEL`);
      }
    });
  });

  describe('log', (): void => {
    it('invokes appender, given valid level and record', (done): void => {
      logger = new ULogger(ULogger.LEVEL_DEBUG, appender);
      logger.log(ULogger.LEVEL_TRACE, { n: 1 });
      logger.log(ULogger.LEVEL_DEBUG, { n: 2 });
      logger.log(ULogger.LEVEL_INFO, { n: 3 });

      defer((): void => {
        expect(appender).toHaveBeenNthCalledWith(1, 'DEBUG', { n: 2 });
        expect(appender).toHaveBeenNthCalledWith(2, 'INFO', { n: 3 });
        done();
      }, 10);
    });

    it('does not invoke appender, given invalid level', (done): void => {
      logger = new ULogger(ULogger.LEVEL_TRACE, appender);
      logger.log('INVALID', {});

      defer((): void => {
        expect(appender).not.toBeCalled();
        done();
      }, 10);
    });

    it('does not invoke appender, given invalid record', (done): void => {
      logger = new ULogger(ULogger.LEVEL_TRACE, appender);
      logger.log(ULogger.LEVEL_TRACE, undefined);
      logger.log(ULogger.LEVEL_TRACE, null);

      defer((): void => {
        expect(appender).not.toBeCalled();
        done();
      }, 10);
    });

    it('suppresses appender error, given appender throws', (done): void => {
      (appender as jest.Mock).mockImplementation((): void => {
        throw new Error('Expected');
      });

      logger = new ULogger(ULogger.LEVEL_TRACE, appender);
      logger.log(ULogger.LEVEL_TRACE, {});

      defer((): void => {
        expect(appender).toBeCalledTimes(1);
        done();
      }, 10);
    });
  });
});
