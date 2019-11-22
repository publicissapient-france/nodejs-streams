import hello from './hello';

test('Hello', () => {
  expect(hello('Stéphane')).toBe('Hello Stéphane!\n');
});
