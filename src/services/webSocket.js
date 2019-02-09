import DiffMatchPatch from 'diff-match-patch';

exports.webSocket = ($q, $rootScope, userSrvc, projectPropertySrvc, logger) => {
  // We return this object to anything injecting our service
  const Service = {};
  let orig = '';
  let ws;

  function init(topic, msgCallback, getCurrentMsg, messageValidate) {
    function disconnect() {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      } else if (ws) {
        logger.info(`webSocket is not open: ${ws.readyState}`);
      }
    }

    function connect() {
      const url = projectPropertySrvc.getWsEndPointUrl(topic);
      ws = new WebSocket(url);
    }

    function listener(data) {
      const messageObj = JSON.parse(data);
      logger.debug(`Received data from websocket: ${messageObj}`);
      if (typeof msgCallback === 'function') {
        const newVal = getCurrentMsg();
        const diff = new DiffMatchPatch().patch_make(orig, newVal);
        if (messageObj.patchObj !== undefined && typeof getCurrentMsg === 'function' && diff.length > 0) {
          const currentMsg = getCurrentMsg();
          const patch = messageObj.patch;
          const patched = new DiffMatchPatch().patch_apply(patch, currentMsg);
          if (typeof messageValidate === 'function' || messageValidate(patch[0])) {
            msgCallback(patched[0]);
            orig = ` ${messageObj.content} `.trim();
          }
        } else {
          msgCallback(messageObj.content);
          orig = ` ${messageObj.content} `.trim();
        }
      }
    }


    disconnect();
    projectPropertySrvc.onLoad(connect);

    ws.onopen = () => {
      logger.info('Socket has been opened!');
      ws.send(JSON.stringify(userSrvc.getUser()));
    };

    ws.onmessage = (message) => {
      listener(message.data);
    };

    ws.onclose = (event) => {
      logger.info(`onclose:: ${JSON.stringify(event, null, 4)}`);
    };

    ws.onerror = (event) => {
      logger.info(`onerror:: ${JSON.stringify(event, null, 4)}`);
    };

    function sendRequest() {
      const newVal = getCurrentMsg();
      const diff = new DiffMatchPatch().patch_make(orig, newVal);
      if (diff.length > 0) {
        logger.debug(`Sending request: ${newVal}`);
        const reqObj = {
          patchObj: diff,
          user: userSrvc.getUser(),
        };
        ws.send(JSON.stringify(reqObj));
        orig = newVal;
      }
    }

    Service.sendRequest = sendRequest;
    Service.disconnect = disconnect;
  }

  Service.init = init;
  return Service;
};
