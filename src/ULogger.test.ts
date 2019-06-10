/* eslint-disable @typescript-eslint/no-explicit-any */

import ULogger from './ULogger';
import defer from 'lodash.defer';

type Appender = (level: string, record: NonNullable<any>) => void | Promise<void>;

describe(
  ULogger.name,
  (): void => {
    let logger: ULogger;
    let appender: Appender;

    beforeEach(
      (): void => {
        appender = jest.fn();
      }
    );

    describe('constructor', (): void => {
      it('constructs instance, given valid level and appender', (done): void => {
        logger = new ULogger(ULogger.LEVEL_TRACE, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        defer((): void => {
          expect(appender).toHaveBeenCalledTimes(1);
          done();
        }, 10);
      });

      it('constructs instance with default level (silent), given invalid level', (done): void => {
        logger = new ULogger(999, appender);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(('DEBUG' as unknown) as number, appender);
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
        logger = new ULogger(ULogger.LEVEL_TRACE, ('' as unknown) as () => void);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(ULogger.LEVEL_TRACE, (undefined as unknown) as () => void);
        logger.log(ULogger.LEVEL_TRACE, {});

        logger = new ULogger(ULogger.LEVEL_TRACE, (null as unknown) as () => void);
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

    describe('toLevel (static)', (): void => {
      it('returns appropriate numeric level, given a string label', (): void => {
        expect(ULogger.toLevel('SILENT')).toEqual(ULogger.LEVEL_SILENT);
        expect(ULogger.toLevel('silent')).toEqual(ULogger.LEVEL_SILENT);
        expect(ULogger.toLevel(ULogger.LEVEL_SILENT_LABEL)).toEqual(ULogger.LEVEL_SILENT);

        expect(ULogger.toLevel('TRACE')).toEqual(ULogger.LEVEL_TRACE);
        expect(ULogger.toLevel('trace')).toEqual(ULogger.LEVEL_TRACE);
        expect(ULogger.toLevel(ULogger.LEVEL_TRACE_LABEL)).toEqual(ULogger.LEVEL_TRACE);

        expect(ULogger.toLevel('DEBUG')).toEqual(ULogger.LEVEL_DEBUG);
        expect(ULogger.toLevel('debug')).toEqual(ULogger.LEVEL_DEBUG);
        expect(ULogger.toLevel(ULogger.LEVEL_DEBUG_LABEL)).toEqual(ULogger.LEVEL_DEBUG);

        expect(ULogger.toLevel('INFO')).toEqual(ULogger.LEVEL_INFO);
        expect(ULogger.toLevel('info')).toEqual(ULogger.LEVEL_INFO);
        expect(ULogger.toLevel(ULogger.LEVEL_INFO_LABEL)).toEqual(ULogger.LEVEL_INFO);

        expect(ULogger.toLevel('WARN')).toEqual(ULogger.LEVEL_WARN);
        expect(ULogger.toLevel('warn')).toEqual(ULogger.LEVEL_WARN);
        expect(ULogger.toLevel(ULogger.LEVEL_WARN_LABEL)).toEqual(ULogger.LEVEL_WARN);

        expect(ULogger.toLevel('ERROR')).toEqual(ULogger.LEVEL_ERROR);
        expect(ULogger.toLevel('error')).toEqual(ULogger.LEVEL_ERROR);
        expect(ULogger.toLevel(ULogger.LEVEL_ERROR_LABEL)).toEqual(ULogger.LEVEL_ERROR);

        expect(ULogger.toLevel((undefined as unknown) as string)).toEqual(ULogger.LEVEL_SILENT);
        expect(ULogger.toLevel((null as unknown) as string)).toEqual(ULogger.LEVEL_SILENT);
        expect(ULogger.toLevel((123 as unknown) as string)).toEqual(ULogger.LEVEL_SILENT);
        expect(ULogger.toLevel(({} as unknown) as string)).toEqual(ULogger.LEVEL_SILENT);
      });
    });
  }
);
