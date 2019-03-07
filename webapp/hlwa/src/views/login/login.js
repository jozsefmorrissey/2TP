exports.loginCtrl = ($scope, userSrvc, Hash, config) => {
  $scope.user = {};
  function success(msg) {
    function callback(resp) {
      if (resp.data) {
        $scope.success = msg;
      }
      $scope.failure = undefined;
    }
    return callback;
  }

  function failure(resp) {
    if (resp.data) {
      $scope.failure = resp.data.message;
    }
    $scope.success = undefined;
  }

  function validateEmail() {
    return $scope.user.email &&
      $scope.user.email.match(/.{1,}@.{1,}\.{1,}/) !== null;
  }

  function validateName() {
    return $scope.user.name;
  }

  function validatePassword() {
    return $scope.user.password && $scope.user.password.length > 7;
  }

  function getUser() {
    const user = JSON.parse(JSON.stringify($scope.user));
    user.password = Hash($scope.user.password);
    return user;
  }

  function login() {
    if (validateEmail() && validatePassword()) {
      userSrvc.login(success(undefined), failure, getUser());
      $scope.user.password = '';
      $scope.submitted = false;
    }
  }

  function register() {
    if (validateName() && validateEmail() && validatePassword()) {
      userSrvc.register(success('Registered'), failure, getUser());
      $scope.user.password = '';
      $scope.submitted = false;
      $scope.state = $scope.states.LOGIN;
    }
  }

  function forgot() {
    if (validateEmail()) {
      const msg = 'Check your email for link to reset your password.';
      const data = {
        user: getUser(),
        url: `${config.ORIGIN}/hlwa/#!/reset/`,
      };
      userSrvc.reset(success(msg), failure, data);
      $scope.submitted = false;
      $scope.state = $scope.states.LOGIN;
    }
  }

  $scope.states = {
    LOGIN: login,
    REGISTER: register,
    FORGOT: forgot,
  };

  function submit() {
    $scope.submitted = true;
    $scope.state();
  }

  function toggle(state) {
    $scope.state = state;
  }

  $scope.state = $scope.states.LOGIN;
  $scope.validateName = validateName;
  $scope.validatePassword = validatePassword;
  $scope.validateEmail = validateEmail;
  $scope.submit = submit;
  $scope.toggle = toggle;
};
