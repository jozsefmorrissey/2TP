import weblog from 'webpack-log';
import stack from 'stack-trace';

exports.logger = (config) => {
  const preInitLogs = [];
  const scope = {};
  let logger;

  function init() {
    const level = config.DEBUG_LEVEL;
    logger = weblog({ name: 'HLWA', level });
    for (let index = 0; index < preInitLogs.length; index += 1) {
      const obj = preInitLogs[index];
      logger[obj.type](obj.msg);
    }
  }

  function log(type, msg) {
    if (logger) {
      logger[type](msg);
    } else {
      preInitLogs.push({ type, msg });
    }
  }

  function format(level, msg) {
    const caller = stack.get()[2];

    const fn = caller.getFunctionName();
    const fln = caller.getFileName();
    const ln = caller.getLineNumber() - 2;
    const cn = caller.getColumnNumber();

    let locInfo = `[${fln}/${fn} - ${ln}:${cn}] `;

    if (msg) {
      if (typeof msg === 'object') {
        locInfo += JSON.stringify(msg, null, 2);
      } else {
        locInfo += msg;
      }
    }

    log(level, locInfo);
  }

  scope.trace = (msg) => {
    format('trace', msg);
  };

  scope.debug = (msg) => {
    format('debug', msg);
  };

  scope.info = (msg) => {
    format('info', msg);
  };

  scope.warn = (msg) => {
    format('warn', msg);
  };

  scope.error = (msg) => {
    format('error', msg);
  };

  scope.silent = (msg) => {
    format('silent', msg);
  };

  init();

  return scope;
};
