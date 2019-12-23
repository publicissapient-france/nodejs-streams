import { Writable } from 'stream';

import WritableLogger from '../logger';

class FeedWritable {
  private data = 0;

  dataLimit = 100;

  constructor(public speed: number, private writable: Writable) {}

  run(): void {
    setTimeout(() => this.sendData(), this.speed);
  }

  private sendData(): void {
    this.data += 1;

    if (this.data < this.dataLimit) {
      this.handleWrite();
    } else {
      this.handleEnd();
    }
  }

  private handleWrite(): void {
    const isWritable = this.writable.write(this.data.toString());
    if (isWritable) {
      this.run();
    } else {
      this.handleDrainOnce();
    }
  }

  private handleDrainOnce(): void {
    this.writable.once('drain', () => this.run());
  }

  private handleEnd(): void {
    this.writable.end(this.data.toString());
  }
}

const writable = new WritableLogger(50);
writable.speed = 150;

new FeedWritable(50, writable).run();
