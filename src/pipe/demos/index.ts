import { pipeline } from 'stream';

import ReadableCounter from '../../readable/counter';
import WritableLogger from '../../writable/logger';

const readable = new ReadableCounter(100, 1, 20);
readable.speed = 100;
readable.logEnabled = false;

const writable = new WritableLogger(50);
writable.speed = 200;
writable.logEnabled = true;

/*
// Méthode classique
readable.on('error', logError).pipe(writable.on('error', logError));
*/

// Nouvelle méthode avec erreurs mutualisées (à partir de node 10)
pipeline(readable, writable).on('error', logError);

function logError(err: Error): void {
  console.error(err);
}
