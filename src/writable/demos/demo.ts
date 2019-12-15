import ReadableCounter from '../../readable/counter';
import WritableLogger from '../logger';

const readable = new ReadableCounter(100, 1, 25);
readable.speed = 40;
readable.enableLogs = false;

const writable = new WritableLogger(120, 50);
writable.enableLogs = true;

readable.pipe(writable);
