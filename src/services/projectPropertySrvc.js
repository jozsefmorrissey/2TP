exports.projectPropertySrvc = () => {
  const scope = {};
  let config;
  const waiting = [];
  let loaded = false;

  function setConfig() {
    config = {
      ENDPOINT_PAGE: 'page/',
      ENDPOINT_USER_ADD: 'user/add/',
      ENDPOINT_USER_AUTHINTICATE: 'user/authinticate/',
      ENDPOINT_USER_GET: 'user/get/',
      ENDPOINT_USER_LOGIN: 'user/login/',
      ENDPOINT_USER_RESET: 'user/reset/password/',
      ENDPOINT_USER_UPDATE_PASSWORD: 'user/update/password/',
      ENDPOINT_USER_UPDATE: 'user/update/',
      PORT: '8020',
      REST_SRVC_DOMAIN: 'http://32.210.111.221',
      REST_SRVC_PORT: '8010',
      WEB_SOCKET_DOMAIN: 'ws://32.210.111.221',
      WEB_SOCKET_PORT: '8030',
    };

    loaded = true;
    for (let index = 0; index < waiting.length; index += 1) {
      waiting[index]();
    }
  }

  function getRestEndPointUrl(endPointId) {
    if (endPointId) {
      return `${config.REST_SRVC_DOMAIN}:${config.REST_SRVC_PORT}/${config[endPointId]}`;
    }
    return `${config.REST_SRVC_DOMAIN}:${config.REST_SRVC_PORT}`;
  }
  function getWsEndPointUrl(topic) {
    return `${config.WEB_SOCKET_DOMAIN}:${config.WEB_SOCKET_PORT}/topic/${topic}`;
  }

  function get(identifier) {
    return config[identifier];
  }

  // function configError() {
  //   // TODO: Create Error Page
  // }

  // $http.get('http://localhost:3167/config').then(setConfig, configError);
  setConfig();

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
  scope.get = get;
  scope.getWsEndPointUrl = getWsEndPointUrl;
  scope.getRestEndPointUrl = getRestEndPointUrl;
  return scope;
};
