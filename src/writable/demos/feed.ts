import { Writable } from 'stream';

import WritableLogger from '../logger';

class FeedWritable {
  private interval: NodeJS.Timeout | null = null;

  private data = 0;

  dataLimit = 100;

  constructor(public speed: number, private writable: Writable) {
    this.handleFinish();
  }

  start(): void {
    if (this.interval === null) {
      this.interval = setInterval(() => this.callback(), this.speed);
    }
  }

  stop(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private callback(): void {
    this.data += 1;

    if (this.data < this.dataLimit) {
      this.handleWrite();
    } else {
      this.handleEnd();
    }
  }

  private handleWrite(): void {
    const isWritable = this.writable.write(this.data.toString());
    if (!isWritable) {
      this.handleDrainOnce();
    }
  }

  private handleDrainOnce(): void {
    this.stop();
    this.writable.once('drain', () => this.start());
  }

  private handleEnd(): void {
    this.stop();
    this.writable.end(this.data.toString());
  }

  private handleFinish(): void {
    this.writable.on('finish', () => console.log('* finish *')); // FIXME: NOT visible...
  }
}

new FeedWritable(40, new WritableLogger(120)).start();

/*
const stream = new WritableLogger(120);

stream.on('finish', () => console.log('* finish *')); // FIXME: NOT visible...

let count = 0;

function feedStream(): void {
  const interval = setInterval(() => {
    count += 1;

    if (count < 100) {
      const isWritable = stream.write(count.toString());

      if (!isWritable) {
        clearInterval(interval);
        stream.once('drain', feedStream);
      }
    } else {
      clearInterval(interval);
      stream.end(count.toString());
    }
  }, 40);
}

feedStream();
*/