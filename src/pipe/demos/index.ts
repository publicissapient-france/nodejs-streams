import ReadableCounter from '../../readable/counter';
import WritableLogger from '../../writable/logger';

const readable = new ReadableCounter(100, 1, 20);
readable.speed = 100;
readable.logEnabled = false;

const writable = new WritableLogger(50);
writable.speed = 200;
writable.logEnabled = true;

readable.pipe(writable);
