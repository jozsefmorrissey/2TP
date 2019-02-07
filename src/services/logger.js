import weblog from 'webpack-log';

exports.logger = (projectPropertySrvc) => {
  const preInitLogs = [];
  const scope = {};
  let logger;

  function init() {
    const level = 'info';
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

  scope.trace = (msg) => {
    log('trace', msg);
  };

  scope.debug = (msg) => {
    log('debug', msg);
  };

  scope.info = (msg) => {
    log('info', msg);
  };

  scope.warn = (msg) => {
    log('warn', msg);
  };

  scope.error = (msg) => {
    log('error', msg);
  };

  scope.silent = (msg) => {
    log('silent', msg);
  };

  projectPropertySrvc.onLoad(init);

  return scope;
};
