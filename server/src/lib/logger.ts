import { debugCurrentDate } from './utils';

// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
export class Logger {
  static logGreen(text: string) {
    console.log(`\x1b[32m[gateway]: ${text}\x1b[0m`);
  }
  static logGreenUnderline(text: string) {
    console.log('\x1b[32m[gateway]: \x1b[4m' + text + '\x1b[0m');
  }
  static logRed(text: string) {
    console.error('[gateway]: ' + text);
  }
  static logDebugGreen(text: string) {
    console.log(`\x1b[32m[DEBUG]: ${debugCurrentDate(text)}\x1b[0m`);
  }
  static logDebugOrange(text: string) {
    console.warn(`[DEBUG]: ${debugCurrentDate(text)}`);
  }
  static logDebugRed(text: string) {
    console.error(`[DEBUG]: ${debugCurrentDate(text)}`);
  }
  static logOrange(text: string) {
    console.warn(`\x1b[38;5;215m[gateway]: ${text}\x1b[0m`);
  }
  static logOrangeUnderline(text: string) {
    console.warn('[gateway]: \x1b[4m' + text + '\x1b[0m');
  }
}
