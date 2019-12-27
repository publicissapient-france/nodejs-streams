import log from './log';

const writeMock = jest.spyOn(process.stdout, 'write');

describe('log', () => {
  test('should works', () => {
    log('Hello');
    expect(writeMock).toHaveBeenCalledWith('\nHello');
  });
});
