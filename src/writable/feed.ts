import { Writable } from 'stream';

import WritableLogger from './logger';

class FeedWritable {
  private interval: NodeJS.Timeout | null = null;

  private data = 0;

  dataLimit = 100;

  constructor(public speed: number, private writable: Writable) {
    this.handleFinish();
  }

  start(): void {
    if (this.interval !== null) {
      throw new Error('FeedWritable already started');
    }
    this.interval = setInterval(() => this.callback(), this.speed);
  }

  stop(): void {
    if (this.interval === null) {
      throw new Error('FeedWritable already stopped');
    }
    clearInterval(this.interval);
    this.interval = null;
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
      this.stop();
      this.writable.once('drain', () => this.start());
    }
  }

  private handleEnd(): void {
    this.stop();
    this.writable.end(this.data.toString());
  }

  private handleFinish(): void {
    this.writable.on('finish', () => console.log('* finish *'));
  }
}

new FeedWritable(40, new WritableLogger(60)).start();

/*
const stream = new WritableLogger(60);

let count = 0;

function fillStream(): void {
  const interval = setInterval(() => {
    count += 1;
    const isWritable = stream.write(count.toString());
    if (!isWritable) {
      clearInterval(interval);
      stream.once('drain', fillStream);
    }
  }, 40);
}

fillStream();
*/
