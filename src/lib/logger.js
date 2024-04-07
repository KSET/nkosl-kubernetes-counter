const { randomId } = require("./helpers");

const INSTANCE_ID = randomId();

module.exports = class Logger {
  static log(...args) {
    console.log.apply(console, [
      `[${new Date().toISOString()} @ ${INSTANCE_ID}]`,
      ...args,
    ]);
  }

  static error(...args) {
    console.error.apply(console, [
      `[${new Date().toISOString()} @ ${INSTANCE_ID}]`,
      ...args,
    ]);
  }

  static get INSTANCE_ID() {
    return INSTANCE_ID;
  }
};
