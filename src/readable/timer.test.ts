import logMock from './log';
import timer from './timer';

jest.mock('./log');

describe('Timer', () => {
  jest.useFakeTimers();

  it('should works', () => {
    const message = 'Hello';
    const callbackMock = jest.fn();

    timer(message, callbackMock, 1000);

    jest.runOnlyPendingTimers();

    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock).toHaveBeenCalledWith(`* ${message} *`);
    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
});
