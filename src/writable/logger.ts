import logUpdate from 'log-update';
import { Writable } from 'stream';

export default class WritableLogger extends Writable {
  enableLogs = true;

  constructor(public speed: number, public highWaterMark = 50) {
    super({ decodeStrings: false, highWaterMark });
  }

  _write(chunk: string, encoding: string, next: (error?: Error) => void): void {
    setTimeout(() => {
      next();
      if (this.enableLogs) {
        this.log(chunk);
      }
    }, this.speed);
  }

  private log(chunk: string): void {
    const length = this.writableLength.toString().padStart(2, '0');
    const progress = Array(this.writableLength)
      .fill('.')
      .join('');
    logUpdate(`\n<${length}> ${progress}\n\n${chunk}\n\n`);
  }
}
