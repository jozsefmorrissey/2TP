exports.webSocket = ($q, $rootScope, userSrvc) => {
  // We return this object to anything injecting our service
  const Service = {};
  let orig = '';
  let ws;

  function init(topic, msgCallback, getCurrentMsg) {
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

    disconnect();
    // Keep all pending requests here until they get responses
    const callbacks = {};
    // Create a unique callback ID to map requests to responses
    let currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    ws = new WebSocket(`ws://localhost:8000/topic/${topic}`);
    const defaultVal = `<div>
  <label>Topic</label>
  <input ng-keydown='$event.keyCode === 13 && topicChange(topic)' ng-model='topic'/>
  <br>
  <textarea cols=100 rows='12' id='i-made-a-change'
ng-keydown='$event.keyCode === 13 && contentChange(content)'
      ng-model='content' id='test-content' 'so-did-i='false' 'so-did-i='false' 'so-did-i='false'></textarea>
</div>
`;

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
          user: {
              token: '12345',
              email: `user${Math.floor(Math.random() * 10)}`,
          }
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
          msgCallback(patched[0]);
          orig = new String(messageObj.content).toString();
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
