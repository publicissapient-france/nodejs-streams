import ReadableCounter from '../counter';
import log from '../helpers/log';
import timer from '../helpers/timer';

const readable = new ReadableCounter(6);

readable.on('end', () => log('* end *'));

readable.on('readable', readableHandler);

const mode = readable.isPaused() ? 'paused' : 'flowing';
log(`* ${mode} *`);

timer('off(readable)', () => readable.off('readable', readableHandler), 2500);
timer('on(readable)', () => readable.on('readable', readableHandler), 4500);

function readableHandler(): void {
  let chunk: string;
  while ((chunk = readable.read()) !== null) { // eslint-disable-line no-cond-assign
    process.stdout.write(chunk);
  }
}

/* === CONSOLE OUTPUT ===

* paused *

<2> paused
1

<2> paused
2

* off(readable) *

<2> paused
<4> paused

* on(readable) *

3
4

<2> paused
5

<2> paused
6

<0> paused

* end */
