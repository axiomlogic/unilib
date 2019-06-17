/* eslint-disable @typescript-eslint/no-explicit-any */

import defer from 'lodash.defer';
import ULogger from './ULogger';

describe(
  ULogger.name,
  (): void => {
    let logger: ULogger;
    let appender: ULogger.Appender;

    beforeEach(
      (): void => {
        appender = jest.fn();
      }
    );

    describe('constructor', (): void => {
      it('constructs instance, given valid level and appender', (done): void => {
        logger = new ULogger(ULogger.LEVEL_TRACE, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(ULogger.LEVEL_TRACE_LABEL, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(ULogger.LEVEL_TRACE_LABEL.toLowerCase(), appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        defer((): void => {
          expect(appender).toHaveBeenCalledTimes(3);
          done();
        }, 10);
      });

      it('constructs instance with default level (silent), given invalid level', (done): void => {
        logger = new ULogger(999, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(('' as unknown) as number, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger((undefined as unknown) as number, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger((null as unknown) as number, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        defer((): void => {
          expect(appender).not.toHaveBeenCalled();
          done();
        }, 10);
      });

      it('constructs instance with default appender (no-op), given invalid appender', (): void => {
        logger = new ULogger(ULogger.LEVEL_TRACE, ('' as unknown) as ULogger.Appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(ULogger.LEVEL_TRACE, (undefined as unknown) as ULogger.Appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(ULogger.LEVEL_TRACE, (null as unknown) as ULogger.Appender);
        logger.log(ULogger.LEVEL_TRACE, {});
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
        logger.log(999, {});

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
        (appender as jest.Mock).mockImplementation(
          (): void => {
            throw new Error('Expected');
          }
        );

        logger = new ULogger(ULogger.LEVEL_TRACE, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        defer((): void => {
          expect(appender).toBeCalledTimes(1);
          done();
        }, 10);
      });
    });
  }
);
