import log from './log';

const writeMock = jest.spyOn(process.stdout, 'write');

test('log', () => {
  log('Hello');
  expect(writeMock).toHaveBeenCalledWith('\nHello');
});
