exports.webSocket = ($q, $rootScope, userSrvc, projectPropertySrvc) => {
  // We return this object to anything injecting our service
  const Service = {};
  let orig = '';
  let ws;

  function init(topic, msgCallback, getCurrentMsg, messageValidate) {
    function disconnect() {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log('web socket is closed');
      } else if (ws) {
        console.error('webSocket is not open.' + ws.readyState);
      }
      if (ws)
      console.log(`${ws.readyState} === WebSocket.OPEN`)
    }

    function connect() {
      const url = projectPropertySrvc.getWsEndPointUrl(topic);
      ws = new WebSocket(url);
    }

    disconnect();
    // Keep all pending requests here until they get responses
    const callbacks = {};
    // Create a unique callback ID to map requests to responses
    let currentCallbackId = 0;
    projectPropertySrvc.onLoad(connect);

    ws.onopen = function(data){
        console.log("Socket has been opened!");
        ws.send(JSON.stringify(userSrvc.getUser()));
    };

    ws.onmessage = function(message) {
        listener(message.data);
    };

    ws.onclose = function(event) {
        console.log('onclose::' + JSON.stringify(event, null, 4));
    }
    ws.onerror = function(event) {
        console.log('onerror::' + JSON.stringify(event, null, 4));
    }

    function sendRequest() {
      const newVal = getCurrentMsg();
      const diff = new diff_match_patch().patch_make(orig, newVal);
      if (diff.length > 0) {
        console.log('Sending request', newVal);
        const reqObj = {
          patchObj: diff,
          user: userSrvc.getUser(),
        }
        ws.send(JSON.stringify(reqObj));
        orig = newVal;
      }
    }

    function listener(data) {
      let messageObj = JSON.parse(data);
      console.log("Received data from websocket: ", messageObj);
      if (typeof msgCallback === 'function') {
        const newVal = getCurrentMsg();
        const diff = new diff_match_patch().patch_make(orig, newVal);
        if (messageObj.patchObj !== undefined && typeof getCurrentMsg === 'function' && diff.length > 0) {
          const currentMsg = getCurrentMsg();
          const patch = messageObj.patch;
          const patched = new diff_match_patch().patch_apply(patch, currentMsg);
          if (typeof messageValidate === 'function' || messageValidate(patch[0])) {
            msgCallback(patched[0]);
            orig = new String(messageObj.content).toString();
          }
        } else {
          msgCallback(messageObj.content);
          orig = new String(messageObj.content).toString();
        }
      }
      }

    Service.sendRequest = sendRequest;
    Service.disconnect = disconnect;
  }

  Service.init = init;
  return Service;
};
