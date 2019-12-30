import { Readable, Writable } from 'stream';

export class Read extends Readable {
  private end = false;

  _read(): void {
    if (!this.end) {
      this.push('data');
      this.end = true;
    } else {
      this.push(null);
    }
  }
}

export class Write extends Writable {
  _write(chunk: string, encoding: string, next: (error?: Error) => void): void {
    next();
  }
}

export class ReadAndEmitError extends Readable {
  _read(): void {
    this.emit('error', new Error('Unable to read data.'));
  }
}

export class WriteAndEmitError extends Writable {
  _write(): void {
    this.emit('error', new Error('Unable to write data.'));
  }
}

export class WriteAndCallNextWithError extends Writable {
  _write(chunk: string, encoding: string, next: (error?: Error) => void): void {
    next(new Error('Unable to write data!'));
  }
}
