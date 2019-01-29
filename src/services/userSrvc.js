exports.userSrvc = ($cookies, requestSrvc, urlConfig, errorSrvc) => {
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
    requestSrvc.post(urlConfig.USER_ADD, success, failure, data);
  }

  function login(success, failure, data) {
    requestSrvc.post(urlConfig.USER_LOGIN, loginCallback(success), failure, data);
  }

  function reset(success, failure, data) {
    requestSrvc.post(urlConfig.RESET, success, failure, data);
  }

  function onLogin(func) {
    if (typeof func === 'function') {
      onLoginFuncs.push(func);
    }
  }

  function updatePassword(success, failure, data) {
    requestSrvc.post(urlConfig.UPDATE_PASSWORD, success, failure, data);
  }

  function loginFailure() {
    errorSrvc('login', 'Failed to login');
  }


  getUser();
  if (user) {
    requestSrvc.post(urlConfig.AUTHINTICATE, loginCallback(),
        loginFailure, { email: user.email, userToken: user.userToken });
  }

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
