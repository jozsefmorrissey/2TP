exports.userSrvc = ($http, $cookies, requestSrvc, urlConfig, errorSrvc,
    projectPropertySrvc) => {
  const scope = {};
  const USER_TOKEN = 'hlwa.UserToken';
  const USER_EMAIL = 'hlwa.UserEmail';
  const onLoginFuncs = [];
  let user;
  let loggedIn = false;


  function setUser(u) {
    user = u;
    $cookies.put(USER_EMAIL, u.email);
    $cookies.put(USER_TOKEN, u.userToken);
  }

  function runLogInFuncs() {
    for (let index = 0; index < onLoginFuncs.length; index += 1) {
      onLoginFuncs[index]();
    }
  }

  function isLoggedIn() {
    return loggedIn;
  }

  function logOut() {
    setUser({});
    loggedIn = false;
    runLogInFuncs();
  }

  function getUser() {
    const email = $cookies.get(USER_EMAIL);
    const userToken = $cookies.get(USER_TOKEN);
    if (email && userToken) {
      user = { email, userToken };
      return user;
    }
    return undefined;
  }

  function loginCallback(otherCallback) {
    function callSetUser(body) {
      loggedIn = true;
      if (body.data.userToken) {
        setUser(body.data);
      }
      if (typeof otherCallback === 'function') {
        otherCallback(body);
      }
      runLogInFuncs();
    }
    return callSetUser;
  }


  function register(success, failure, data) {
    const url = projectPropertySrvc.getRestEndPointUrl('ENDPOINT_USER_ADD');
    const request = {
      method: 'POST',
      url,
      data,
    };

    $http(request).then(success, failure);
  }

  function login(success, failure, data) {
    const url = projectPropertySrvc.getRestEndPointUrl('ENDPOINT_USER_LOGIN');
    const request = {
      method: 'POST',
      url,
      data,
    };

    $http(request).then(loginCallback(success), failure);
  }

  function reset(success, failure, data) {
    const url = projectPropertySrvc.getRestEndPointUrl('ENDPOINT_USER_RESET');
    const request = {
      method: 'POST',
      url,
      data,
    };

    $http(request).then(success, failure);
  }

  function onLogin(func) {
    if (typeof func === 'function') {
      onLoginFuncs.push(func);
    }
  }

  function updatePassword(success, failure, data) {
    const url = projectPropertySrvc.getRestEndPointUrl('ENDPOINT_USER_UPDATE_PASSWORD');
    const request = {
      method: 'POST',
      url,
      data,
    };

    $http(request).then(success, failure);
  }

  function loginFailure() {
    errorSrvc('login', 'Failed to login');
  }

  function initialLogin() {
    if (user) {
      const url = projectPropertySrvc.getRestEndPointUrl('ENDPOINT_USER_AUTHINTICATE');
      const request = {
        method: 'POST',
        url,
        data: { email: user.email, userToken: user.userToken },
      };

      $http(request).then(loginCallback(), loginFailure);
    }
  }

  getUser();
  projectPropertySrvc.onLoad(initialLogin);

  scope.register = register;
  scope.login = login;
  scope.reset = reset;
  scope.setUser = setUser;
  scope.getUser = getUser;
  scope.isLoggedIn = isLoggedIn;
  scope.onLogin = onLogin;
  scope.logOut = logOut;
  scope.updatePassword = updatePassword;
  return scope;
};
