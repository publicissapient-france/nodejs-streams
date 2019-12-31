import { EventEmitter } from 'events';

describe('EventEmitter', () => {
  test('should listen to emitted events', () => {
    const source = new EventEmitter();

    const event = 'foo';
    const data1 = 'bar';
    const data2 = ['qix'];
    const data3 = 99;

    const listenerMock = jest.fn();
    source.on(event, listenerMock);

    source.emit(event, data1);
    source.emit(event, data2, data3);

    expect(listenerMock).toHaveBeenNthCalledWith(1, data1);
    expect(listenerMock).toHaveBeenNthCalledWith(2, data2, data3);
  });
});
