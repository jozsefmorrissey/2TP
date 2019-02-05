exports.projectPropertySrvc = ($http) => {
  const scope = {};
  let config;
  let waiting = [];
  let loaded = false;

  function setConfig(resp) {
    config = resp.data;
    loaded = true;
    for (let index = 0; index < waiting.length; index += 1) {
      waiting[index]();
    }
  }

  function getRestEndPointUrl(endPointId) {
      if (endPointId) {
        return `${config.REST_SRVC_DOMAIN}:${config.REST_SRVC_PORT}/${config[endPointId]}`;
      } else {
        return `${config.REST_SRVC_DOMAIN}:${config.REST_SRVC_PORT}`;
      }
  }
  function getWsEndPointUrl(topic) {
      return `${config.WEB_SOCKET_DOMAIN}:${config.WEB_SOCKET_PORT}/topic/${topic}`;
  }

  function configError() {
    // TODO: Create Error Page
  }

  $http.get(`http://localhost:3167/config`).then(setConfig, configError);

  function onLoad(func) {
    if (typeof func === 'function' && loaded) {
        func();
        return;
    }

    if (typeof func === 'function') {
      waiting.push(func);
    }
  }

  scope.onLoad = onLoad;
  scope.getWsEndPointUrl = getWsEndPointUrl;
  scope.getRestEndPointUrl = getRestEndPointUrl
  return scope;
};
