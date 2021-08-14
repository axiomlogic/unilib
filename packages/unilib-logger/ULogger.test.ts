/* eslint-disable @typescript-eslint/no-explicit-any */

import defer from 'lodash.defer';
import UError from 'unilib-error';
import ILogger, { LogLevel } from './ILogger';
import ULogger from './ULogger';

describe(ULogger.name, (): void => {
  let logger: ULogger;
  let appender: ULogger.Appender;

  beforeEach((): void => {
    appender = jest.fn();
  });

  describe('constructor', (): void => {
    it('constructs instance, given valid level and NO appender', (): void => {
      logger = new ULogger(ILogger.LEVEL_TRACE);
      logger.log(ILogger.LEVEL_TRACE, {});
    });

    it('constructs instance, given valid level and appender', (done): void => {
      logger = new ULogger(ILogger.LEVEL_TRACE, appender);
      logger.log(ILogger.LEVEL_TRACE, {});

      defer((): void => {
        expect(appender).toHaveBeenCalledTimes(1);
        done();
      }, 10);
    });

    it('throws, given invalid level', (): void => {
      try {
        logger = new ULogger('' as unknown as LogLevel, appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger(123 as unknown as LogLevel, appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger(undefined as unknown as LogLevel, appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger(null as unknown as LogLevel, appender);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_LEVEL`);
      }
    });

    it('throws, given invalid appender', (): void => {
      try {
        logger = new ULogger(ILogger.LEVEL_TRACE, '' as unknown as ULogger.Appender);
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_APPENDER`);
      }

      try {
        logger = new ULogger(ILogger.LEVEL_TRACE, undefined as unknown as ULogger.Appender);
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_APPENDER`);
      }

      try {
        logger = new ULogger(ILogger.LEVEL_TRACE, null as unknown as ULogger.Appender);
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.constructor/INVALID_APPENDER`);
      }
    });
  });

  describe('getLevel', (): void => {
    it('returns current level, given no arguments', (): void => {
      logger = new ULogger(ILogger.LEVEL_TRACE, appender);
      expect(logger.getLevel()).toEqual(ILogger.LEVEL_TRACE);
    });
  });

  describe('setLevel', (): void => {
    it('sets new level, given valid level', (): void => {
      logger = new ULogger(ILogger.LEVEL_TRACE, appender);
      logger.setLevel(ILogger.LEVEL_DEBUG);
      expect(logger.getLevel()).toEqual(ILogger.LEVEL_DEBUG);
    });

    it('throws, given an invalid level', (): void => {
      try {
        logger = new ULogger(ILogger.LEVEL_TRACE, appender);
        logger.setLevel('' as unknown as LogLevel);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.setLevel/INVALID_LEVEL`);
      }

      try {
        logger = new ULogger(ILogger.LEVEL_TRACE, appender);
        logger.setLevel(undefined as unknown as LogLevel);
        fail(new Error('Unexpected'));
      } catch (error) {
        expect(error).toBeInstanceOf(UError);
        expect(error.message).toEqual(`${ULogger.name}.setLevel/INVALID_LEVEL`);
      }
    });
  });

  describe('log', (): void => {
    it('invokes appender, given valid level and record', (done): void => {
      logger = new ULogger(ILogger.LEVEL_DEBUG, appender);
      logger.log(ILogger.LEVEL_TRACE, { n: 1 });
      logger.log(ILogger.LEVEL_DEBUG, { n: 2 });
      logger.log(ILogger.LEVEL_INFO, { n: 3 });

      defer((): void => {
        expect(appender).toHaveBeenNthCalledWith(1, 'DEBUG', { n: 2 });
        expect(appender).toHaveBeenNthCalledWith(2, 'INFO', { n: 3 });
        done();
      }, 10);
    });

    it('does not invoke appender, given invalid level', (done): void => {
      logger = new ULogger(ILogger.LEVEL_TRACE, appender);
      logger.log('INVALID' as unknown as LogLevel, {});

      defer((): void => {
        expect(appender).not.toBeCalled();
        done();
      }, 10);
    });

    it('does not invoke appender, given invalid record', (done): void => {
      logger = new ULogger(ILogger.LEVEL_TRACE, appender);
      logger.log(ILogger.LEVEL_TRACE, undefined);
      logger.log(ILogger.LEVEL_TRACE, null);

      defer((): void => {
        expect(appender).not.toBeCalled();
        done();
      }, 10);
    });

    it('suppresses appender error, given appender throws', (done): void => {
      (appender as jest.Mock).mockImplementation((): void => {
        throw new Error('Expected');
      });

      logger = new ULogger(ILogger.LEVEL_TRACE, appender);
      logger.log(ILogger.LEVEL_TRACE, {});

      defer((): void => {
        expect(appender).toBeCalledTimes(1);
        done();
      }, 10);
    });
  });
});
