import ReadableCounter from './counter';
import log from './log';
import timer from './timer';

const dataLimit = 6;
const readable = new ReadableCounter(dataLimit);

readable.on('end', () => log('* end *'));

readable.on('data', dataHandler);
readable.on('readable', readableHandler);

const mode = readable.isPaused() ? 'paused' : 'flowing';
log(`* ${mode} *`);

timer('off(readable)', () => readable.off('readable', readableHandler), 2500);
timer('on(readable)', () => readable.on('readable', readableHandler), 4500);

function dataHandler(chunk: string): void {
  process.stdout.write(`${chunk} <- data`);
}

function readableHandler(): void {
  let chunk: string;
  while ((chunk = readable.read()) !== null) { // eslint-disable-line no-cond-assign
    process.stdout.write(`${chunk} <- read`);
  }
}

/* === CONSOLE OUTPUT ===

* paused *

<2> paused
1 <- data
1 <- read

<2> paused
2 <- data
2 <- read

* off(readable) *

3 <- data
<0> flowing

4 <- data
<0> flowing

* on(readable) *

<2> paused
5 <- data
5 <- read

<2> paused
6 <- data
6 <- read

<0> paused

* end */
