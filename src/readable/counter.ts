import { Readable } from 'stream';

import { Log } from './log-factory';

export default class Counter extends Readable {
  data = 0;

  constructor(public limit: number, public log: Log) {
    super({ encoding: 'utf8' });
  }

  _read(): void {
    setTimeout(() => this.pushData(), 1000);
  }

  private pushData(): void {
    this.data += 1;

    if (this.data <= this.limit) {
      this.push(`\n${this.data}`);
    } else {
      this.push(null);
    }

    const status = this.isPaused() ? 'paused' : 'flowing';
    this.log(`<${this.readableLength}> ${status}`);
  }
}
