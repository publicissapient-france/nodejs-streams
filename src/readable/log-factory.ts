export interface Log {
  (message: string): void;
}

export default (newLine: 'before' | 'after'): Log => (message: string): void => {
  const before = newLine === 'before' ? '\n' : '';
  const after = newLine === 'after' ? '\n' : '';

  process.stdout.write(`\n${before}${message}${after}`);
};
