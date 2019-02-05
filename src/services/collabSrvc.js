exports.collab = ($http, $state, $stateParams, $transitions, $cookies, $timeout,
    errorSrvc, stringMapSrvc, Hash, userSrvc, eventSrvc, promiseSrvc, projectPropertySrvc) => {
  const scope = {};
  let topicInfo;
  let serverTopicInfo;

  let visualUpdater;
  function updateContent(content) {
    topicInfo = content;
    visualUpdater(content);
  }
  function getContent() {
    return topicInfo;
  }

  function contentChange() {
    webSocket.sendRequest();
  }

  scope.EVENT = 'config-update';

  function saveUserVersion() {
    const user = userSrvc.getUser();
    const userVersion = { jsonObj: JSON.stringify(topicInfo), id: { pageIdentifier: configSrvc.getState() } };
    const data = {
      url: 'http://localhost:9999/version/update',
      method: 'POST',
      data: { user, userVersion },
    };
    function onError() {
      errorSrvc(data.url, 'Failed to save user Data.');
    }
    $http(data).then(undefined, onError);
  }

  const updatePending = {};
  function runUpdateFuncs(attr) {
    function triggerUpdate() {
      eventSrvc.trigger(getUpdateEvent(attr), topicInfo);
      updatePending[attr] = false;
    }

    if (!updatePending[attr]) {
      $timeout(triggerUpdate, 3000);
    }
    updatePending[attr] = true;
  }

  function indicateChange() {
    if (Hash(topicInfo) !== Hash(serverTopicInfo)) {
      errorSrvc('nav-alert', 'Unsaved content');
      $cookies.put(configSrvc.getCookieTopicId(), JSON.stringify(topicInfo));
    } else {
      errorSrvc('nav-alert', null);
    }
  }

  function saveTopicInfo(value, attr, key) {
    if (key !== undefined) {
      topicInfo[attr.toLowerCase()][key] = value;
    } else {
      topicInfo[attr.toLowerCase()] = value;
    }
    indicateChange();
    runUpdateFuncs(attr);
    saveUserVersion();
  }

  scope.saveTopicInfo = saveTopicInfo;
  return scope;
};
