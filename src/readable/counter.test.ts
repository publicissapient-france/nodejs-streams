import ReadableCounter from './counter';

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
  const stream = new ReadableCounter(3);
  stream.speed = 0;

  const readSpy = jest.spyOn(stream, '_read');
  const pushSpy = jest.spyOn(stream, 'push');

  const dataHandlerMock = jest.fn();
  stream.on('data', dataHandlerMock);

  expect(stream.isPaused()).toBeFalsy();

  stream.on('end', () => {
    expect(readSpy).toHaveBeenCalledTimes(4);
    expect(pushSpy).toHaveBeenCalledTimes(4);

    expect(dataHandlerMock).toHaveBeenCalledTimes(3);
    expect(dataHandlerMock).toHaveBeenNthCalledWith(1, '\n1');
    expect(dataHandlerMock).toHaveBeenNthCalledWith(2, '\n2');
    expect(dataHandlerMock).toHaveBeenNthCalledWith(3, '\n3');
    done();
  });
});

test('ReadableCounter with "data" handler and batch', done => {
  const stream = new ReadableCounter(3, 2);
  stream.speed = 0;

  const readSpy = jest.spyOn(stream, '_read');
  const pushSpy = jest.spyOn(stream, 'push');

  const dataHandlerMock = jest.fn();
  stream.on('data', dataHandlerMock);

  expect(stream.isPaused()).toBeFalsy();

  stream.on('end', () => {
    expect(readSpy).toHaveBeenCalledTimes(2);
    expect(pushSpy).toHaveBeenCalledTimes(4);

    expect(dataHandlerMock).toHaveBeenCalledTimes(3);
    expect(dataHandlerMock).toHaveBeenNthCalledWith(1, '\n1');
    expect(dataHandlerMock).toHaveBeenNthCalledWith(2, '\n2');
    expect(dataHandlerMock).toHaveBeenNthCalledWith(3, '\n3');
    done();
  });
});

test('ReadableCounter with "readable" handler', done => {
  const stream = new ReadableCounter(3);
  stream.speed = 0;

  const readSpy = jest.spyOn(stream, '_read');
  const pushSpy = jest.spyOn(stream, 'push');

  const readReturnMock = jest.fn();

  stream.on('readable', () => {
    let chunk: string;
    while ((chunk = stream.read()) !== null) {
      readReturnMock(chunk);
    }
  });

  expect(stream.isPaused()).toBeTruthy();

  stream.on('end', () => {
    expect(readSpy).toHaveBeenCalledTimes(4);
    expect(pushSpy).toHaveBeenCalledTimes(4);

    expect(readReturnMock).toBeCalledTimes(3);
    expect(readReturnMock).toHaveBeenNthCalledWith(1, '\n1');
    expect(readReturnMock).toHaveBeenNthCalledWith(2, '\n2');
    expect(readReturnMock).toHaveBeenNthCalledWith(3, '\n3');
    done();
  });
});

test('ReadableCounter with "readable" handler and batch', done => {
  const stream = new ReadableCounter(3, 2);
  stream.speed = 0;

  const readSpy = jest.spyOn(stream, '_read');
  const pushSpy = jest.spyOn(stream, 'push');

  const readReturnMock = jest.fn();

  stream.on('readable', () => {
    let chunk: string;
    while ((chunk = stream.read()) !== null) {
      readReturnMock(chunk);
    }
  });

  expect(stream.isPaused()).toBeTruthy();

  stream.on('end', () => {
    expect(readSpy).toHaveBeenCalledTimes(2);
    expect(pushSpy).toHaveBeenCalledTimes(4);

    expect(readReturnMock).toBeCalledTimes(2);
    expect(readReturnMock).toHaveBeenNthCalledWith(1, '\n1\n2');
    expect(readReturnMock).toHaveBeenNthCalledWith(2, '\n3');
    done();
  });
});

test('ReadableCounter with "readable" handler, batch and highWaterMark reached', done => {
  const stream = new ReadableCounter(5, 5, 6);
  stream.speed = 0;

  const readSpy = jest.spyOn(stream, '_read');
  const pushSpy = jest.spyOn(stream, 'push');

  const readReturnMock = jest.fn();

  stream.on('readable', () => {
    let chunk: string;
    while ((chunk = stream.read()) !== null) {
      readReturnMock(chunk);
    }
  });

  expect(stream.isPaused()).toBeTruthy();

  stream.on('end', () => {
    expect(readSpy).toHaveBeenCalledTimes(2);
    expect(pushSpy).toHaveBeenCalledTimes(6);

    expect(pushSpy).toHaveNthReturnedWith(1, true);
    expect(pushSpy).toHaveNthReturnedWith(2, true);
    expect(pushSpy).toHaveNthReturnedWith(3, false); // highWaterMark of 6 bits reached
    expect(pushSpy).toHaveNthReturnedWith(4, true);
    expect(pushSpy).toHaveNthReturnedWith(5, true);
    expect(pushSpy).toHaveNthReturnedWith(6, false);

    expect(readReturnMock).toBeCalledTimes(2);
    expect(readReturnMock).toHaveBeenNthCalledWith(1, '\n1\n2\n3');
    expect(readReturnMock).toHaveBeenNthCalledWith(2, '\n4\n5');
    done();
  });
});
