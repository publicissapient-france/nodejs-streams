import Counter from './counter';
import logFactory from './log-factory';

const log = logFactory('before');

const stream = new Counter(6, log);

stream.on('end', () => log('* end *'));

stream.on('data', dataHandler);
stream.on('readable', readableHandler);

log(stream.isPaused() ? 'paused' : 'flowing');

setTimeout(() => {
  log('* off(readable) *');
  stream.off('readable', readableHandler);
}, 2500);

setTimeout(() => {
  log('* on(readable) *');
  stream.on('readable', readableHandler);
}, 4500);

function dataHandler(chunk: string): void {
  process.stdout.write(`${chunk} <- data`);
}

function readableHandler(): void {
  let chunk: string;
  while ((chunk = stream.read()) !== null) { // eslint-disable-line no-cond-assign
    process.stdout.write(`${chunk} <- read`);
  }
}
