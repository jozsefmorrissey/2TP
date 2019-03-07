// Largly borrowed from https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript
exports.eventSrvc = (logger) => {
  const scope = {};
  const events = {};
  function on(event, callback) {
    events[event] = events[event] || [];
    events[event].push(callback);
  }

  function trigger(event, data) {
    logger.debug(arguments);
    const handlers = events[event];

    if (!handlers || handlers.length < 1) {
      return;
    }

    function run(handler) {
      handler(data);
    }

    handlers.forEach(run);
  }

  function kill(event) {
    delete events[event];
  }

  scope.on = on;
  scope.trigger = trigger;
  scope.kill = kill;
  return scope;
};
