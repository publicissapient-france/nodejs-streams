import { Readable } from 'stream';

import log from './log';

export default class ReadableCounter extends Readable {
  interval = 1000;

  private data = 0;

  constructor(public dataLimit: number, public batchSize = 1) {
    super({ encoding: 'utf8' });

    this.check();
  }

  private check(): void {
    if (this.dataLimit % this.batchSize !== 0) {
      throw new Error('"dataLimit" should be a multiple of "batchSize"');
    }
  }

  _read(): void {
    setTimeout(() => {
      this.batchData();
      this.logStatus();
    }, this.interval);
  }

  private batchData(): void {
    Array.from(Array(this.batchSize)).forEach(() => this.pushData());
  }

  private pushData(): void {
    this.data += 1;

    if (this.data <= this.dataLimit) {
      this.push(`\n${this.data}`);
    } else {
      this.push(null);
    }
  }

  private logStatus(): void {
    const mode = this.isPaused() ? 'paused' : 'flowing';
    log(`<${this.readableLength}> ${mode}`);
  }
}
