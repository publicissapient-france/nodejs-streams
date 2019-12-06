import Counter from './counter';
import logFactory from './log-factory';

const log = logFactory('after');

const stream = new Counter(6, log);

stream.on('end', () => log('* end *'));

stream.pipe(process.stdout);

log(stream.isPaused() ? 'paused' : 'flowing');

setTimeout(() => {
  log('* unpipe *');
  stream.unpipe(process.stdout);
}, 2500);

setTimeout(() => {
  log('* pipe *');
  stream.pipe(process.stdout);
}, 4500);
