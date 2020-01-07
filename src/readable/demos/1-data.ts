import ReadableCounter from '../counter';
import log from '../helpers/log';
import timer from '../helpers/timer';

const readable = new ReadableCounter(6);

readable.on('end', () => log('* end *'));

readable.on('data', dataHandler);

const mode = readable.isPaused() ? 'paused' : 'flowing';
log(`* ${mode} *`);

timer('off(data)', () => readable.off('data', dataHandler), 2500);
timer('on(data)', () => readable.on('data', dataHandler), 4500);

function dataHandler(chunk: string): void {
  process.stdout.write(chunk);
}

/* === CONSOLE OUTPUT ===

* flowing *

1
<0> flowing

2
<0> flowing

* off(data) *

<0> flowing
<0> flowing

* on(data) *

5
<0> flowing

6
<0> flowing

<0> flowing

* end */
