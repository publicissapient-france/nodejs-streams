import logUpdate from 'log-update';
import { Writable } from 'stream';

export default class WritableLogger extends Writable {
  speed = 1000;

  logEnabled = true;

  constructor(highWaterMark?: number) {
    super({ decodeStrings: false, highWaterMark });
  }

  _write(chunk: string, encoding: string, next: (error?: Error) => void): void {
    setTimeout(() => {
      next();
      if (this.logEnabled) {
        this.log(chunk);
      }
    }, this.speed);
  }

  private log(chunk: string): void {
    const length = this.writableLength.toString().padStart(2, '0');
    const progress = Array(this.writableLength)
      .fill('.')
      .join('');
    logUpdate(`\n<${length}> ${progress}\n${chunk}\n\n`);
  }
}
