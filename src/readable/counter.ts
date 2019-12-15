import { Readable } from 'stream';

import log from './helpers/log';

export default class ReadableCounter extends Readable {
  speed = 1000;

  logEnabled = true;

  private data = 0;

  constructor(
    public dataLimit: number,
    public batchSize = 1,
    highWaterMark?: number,
  ) {
    super({ encoding: 'utf8', highWaterMark });
  }

  _read(): void {
    setTimeout(() => {
      this.pushDataBatch();
      if (this.logEnabled) {
        this.log();
      }
    }, this.speed);
  }

  private pushDataBatch(): void {
    const batchSize = Math.min(this.batchSize, this.dataLimit - this.data + 1);
    for (let i = 0; i < batchSize; i += 1) {
      if (!this.pushData()) {
        return;
      }
    }
  }

  private pushData(): boolean {
    this.data += 1;

    if (this.data <= this.dataLimit) {
      return this.push(`\n${this.data}`);
    }
    return this.push(null);
  }

  private log(): void {
    const mode = this.isPaused() ? 'paused' : 'flowing';
    log(`<${this.readableLength}> ${mode}`);
  }
}
