exports.resetCtrl = ($scope, $stateParams, userSrvc, Hash) => {
  $scope.user = {
    email: $stateParams.email,
    userToken: $stateParams.token,
  };

  function success() {
    $scope.success = true;
  }

  function failure() {
    $scope.failure = true;
  }

  function updatePassword() {
    const user = $scope.user;
    if (user.password.length > 7) {
      user.password = Hash(user.password);
      userSrvc.updatePassword(success, failure, user);
    }
  }

  $scope.updatePassword = updatePassword;
};
