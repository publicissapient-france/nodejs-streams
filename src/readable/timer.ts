import log from './log';

export default (message: string, callback: () => void, delay: number): NodeJS.Timeout => {
  return setTimeout(() => {
    log(`* ${message} *`);
    callback();
  }, delay);
};
