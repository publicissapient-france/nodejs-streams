import Counter from './counter';
import logFactory from './log-factory';

const log = logFactory('after');

const stream = new Counter(6, log);

stream.on('end', () => log('* end *'));

stream.on('data', dataHandler);

log(stream.isPaused() ? 'paused' : 'flowing');

setTimeout(() => {
  log('* off(data) *');
  stream.off('data', dataHandler);
  stream.pause();
}, 2500);

setTimeout(() => {
  log('* on(data) *');
  stream.on('data', dataHandler);
  stream.resume();
}, 4500);

function dataHandler(chunk: string): void {
  process.stdout.write(chunk);
}
