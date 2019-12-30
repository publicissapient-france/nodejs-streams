import { pipeline } from 'stream';

import { Read, ReadAndEmitError, Write, WriteAndCallNextWithError, WriteAndEmitError } from '.';

describe('pipe error', () => {
  test('not emitted', done => {
    const read = new Read();
    const write = new Write();

    read.on('end', done);

    read.pipe(write);
  });

  test('when Readable emits error', done => {
    const read = new ReadAndEmitError();
    const write = new Write();

    read.on('error', err => {
      expect(err.message).toBe('Unable to read data.');
      done();
    });

    read.pipe(write);
  });

  test('when Writable emits error', done => {
    const read = new Read();
    const write = new WriteAndEmitError();

    write.on('error', err => {
      expect(err.message).toBe('Unable to write data.');
      done();
    });

    read.pipe(write);
  });

  test('when "pipe" catches Writable error', done => {
    const read = new Read();
    const write = new WriteAndEmitError();

    read.pipe(write).on('error', err => {
      expect(err.message).toBe('Unable to write data.');
      done();
    });
  });

  test('when Writable calls "next" with error', done => {
    const read = new Read();
    const write = new WriteAndCallNextWithError();

    write.on('error', err => {
      expect(err.message).toBe('Unable to write data!');
      done();
    });

    read.pipe(write);
  });
});

describe('pipeline error', () => {
  test('not emitted', done => {
    const read = new Read();
    const write = new Write();

    pipeline(read, write, err => {
      expect(err).toBeUndefined();
      done();
    });
  });

  test('when Readable emits error', done => {
    const read = new ReadAndEmitError();
    const write = new Write();

    pipeline(read, write, err => {
      expect(err).toBeInstanceOf(Error);
      expect(err && err.message).toBe('Unable to read data.');
      done();
    });
  });

  test('when Writable emits error', done => {
    const read = new Read();
    const write = new WriteAndEmitError();

    pipeline(read, write, err => {
      expect(err).toBeInstanceOf(Error);
      expect(err && err.message).toBe('Unable to write data.');
      done();
    });
  });
});
