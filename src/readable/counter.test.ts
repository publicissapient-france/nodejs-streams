import ReadableCounter from './counter';

test('ReadableCounter should check configuration', () => {
  expect(() => new ReadableCounter(4, 1)).not.toThrowError();
  expect(() => new ReadableCounter(4, 2)).not.toThrowError();
  expect(() => new ReadableCounter(4, 4)).not.toThrowError();
  expect(() => new ReadableCounter(4, 3)).toThrowError();
  expect(() => new ReadableCounter(4, 5)).toThrowError();
});

test('ReadableCounter ._read() should call .push()', () => {
  jest.useFakeTimers();

  const stream = new ReadableCounter(2);

  const pushSpy = jest.spyOn(stream, 'push');

  stream._read();
  jest.runOnlyPendingTimers();

  stream._read();
  jest.runOnlyPendingTimers();

  stream._read();
  jest.runOnlyPendingTimers();

  expect(pushSpy).toHaveBeenCalledTimes(3);
  expect(pushSpy).toHaveBeenNthCalledWith(1, '\n1');
  expect(pushSpy).toHaveBeenNthCalledWith(2, '\n2');
  expect(pushSpy).toHaveBeenNthCalledWith(3, null);

  jest.useRealTimers();
});

test('ReadableCounter with "data" handler', done => {
  const stream = new ReadableCounter(2);

  stream.interval = 0;

  const dataHandlerMock = jest.fn();

  stream.on('data', dataHandlerMock);

  expect(stream.isPaused()).toBeFalsy();

  stream.on('end', () => {
    expect(dataHandlerMock).toHaveBeenCalledTimes(2);
    expect(dataHandlerMock).toHaveBeenNthCalledWith(1, '\n1');
    expect(dataHandlerMock).toHaveBeenNthCalledWith(2, '\n2');
    done();
  });
});

test('ReadableCounter with "data" handler and batch', done => {
  const batchSize = 2;
  const stream = new ReadableCounter(2, batchSize);

  stream.interval = 0;

  const dataHandlerMock = jest.fn();

  stream.on('data', dataHandlerMock);

  expect(stream.isPaused()).toBeFalsy();

  stream.on('end', () => {
    expect(dataHandlerMock).toHaveBeenCalledTimes(2);
    expect(dataHandlerMock).toHaveBeenNthCalledWith(1, '\n1');
    expect(dataHandlerMock).toHaveBeenNthCalledWith(2, '\n2');
    done();
  });
});

test('ReadableCounter with "readable" handler', done => {
  const stream = new ReadableCounter(2);

  stream.interval = 0;

  const readReturnMock = jest.fn();

  stream.on('readable', () => {
    let chunk: string;
    while ((chunk = stream.read()) !== null) { // eslint-disable-line no-cond-assign
      readReturnMock(chunk);
    }
  });

  expect(stream.isPaused()).toBeTruthy();

  stream.on('end', () => {
    expect(readReturnMock).toBeCalledTimes(2);
    expect(readReturnMock).toHaveBeenNthCalledWith(1, '\n1');
    expect(readReturnMock).toHaveBeenNthCalledWith(2, '\n2');
    done();
  });
});

test('ReadableCounter with "readable" handler and batch', done => {
  const batchSize = 2;
  const stream = new ReadableCounter(2, batchSize);

  stream.interval = 0;

  const readReturnMock = jest.fn();

  stream.on('readable', () => {
    let chunk: string;
    while ((chunk = stream.read()) !== null) { // eslint-disable-line no-cond-assign
      readReturnMock(chunk);
    }
  });

  expect(stream.isPaused()).toBeTruthy();

  stream.on('end', () => {
    expect(readReturnMock).toBeCalledTimes(1);
    expect(readReturnMock).toHaveBeenCalledWith('\n1\n2');
    done();
  });
});
