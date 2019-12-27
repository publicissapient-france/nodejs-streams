import logUpdateMock from 'log-update';

import WritableLogger from './logger';

jest.mock('log-update');

describe('WritableLogger', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('.write() should call .next()', () => {
    const stream = new WritableLogger();

    const nextMock = jest.fn();

    stream.write('A', 'utf8', nextMock);
    jest.runOnlyPendingTimers();

    stream.write('B', 'utf8', nextMock);
    stream.write('C', 'utf8', nextMock);
    stream.write('D', 'utf8', nextMock);
    stream.write('E', 'utf8', nextMock);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    stream.write('F', 'utf8', nextMock);
    jest.runOnlyPendingTimers();

    expect(nextMock).toHaveBeenCalledTimes(6);

    expect(logUpdateMock).toHaveBeenNthCalledWith(1, logUpdateOutputMock(0, 'A'));
    expect(logUpdateMock).toHaveBeenNthCalledWith(2, logUpdateOutputMock(3, 'B'));
    expect(logUpdateMock).toHaveBeenNthCalledWith(3, logUpdateOutputMock(2, 'C'));
    expect(logUpdateMock).toHaveBeenNthCalledWith(4, logUpdateOutputMock(1, 'D'));
    expect(logUpdateMock).toHaveBeenNthCalledWith(5, logUpdateOutputMock(0, 'E'));
    expect(logUpdateMock).toHaveBeenNthCalledWith(6, logUpdateOutputMock(0, 'F'));
  });

  test('.write() should return false when highWaterMark reached', () => {
    const highWaterMark = 3;
    const stream = new WritableLogger(highWaterMark);

    const isWritable = [stream.write('A'), stream.write('B'), stream.write('C')];

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(isWritable).toEqual([true, true, false]);
  });

  test('should emit "drain" event when writable again', () => {
    const highWaterMark = 3;
    const stream = new WritableLogger(highWaterMark);

    const drainMock = jest.fn();
    stream.on('drain', drainMock);

    stream.write('A');
    stream.write('B');
    stream.write('C');

    jest.runOnlyPendingTimers();
    expect(drainMock).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(drainMock).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(drainMock).toHaveBeenCalled();
  });

  test('with log disabled', () => {
    const stream = new WritableLogger();
    stream.logEnabled = false;

    stream.write('A');
    jest.runOnlyPendingTimers();

    expect(logUpdateMock).not.toHaveBeenCalled();
  });
});

function logUpdateOutputMock(writeableLength: number, chunk: string): string {
  const output = [
    { length: '00', progress: '' },
    { length: '01', progress: '.' },
    { length: '02', progress: '..' },
    { length: '03', progress: '...' },
    { length: '04', progress: '....' },
  ];
  if (writeableLength >= output.length) {
    throw new Error(`Unhandled writeableLength=${writeableLength}`);
  }
  const { length, progress } = output[writeableLength];
  return `\n<${length}> ${progress}\n${chunk}\n\n`;
}
