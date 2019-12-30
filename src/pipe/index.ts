import { pipeline } from 'stream';

import ReadableCounter from '../readable/counter';
import WritableLogger from '../writable/logger';

const readable = new ReadableCounter(100, 1, 20);
readable.speed = 100;
readable.logEnabled = false;

const writable = new WritableLogger(50);
writable.speed = 200;
writable.logEnabled = true;

/*
// Méthode classique avec gestion distincte des erreurs
readable.on('error', (err: Error) => console.error(err));
writable.on('error', (err: Error) => console.error(err));
readable.pipe(writable);
*/

// Nouvelle méthode avec gestion mutualisée des erreurs (à partir de node 10)
pipeline(readable, writable, (err: Error | null) => {
  if (err) {
    console.error(err);
  }
});
