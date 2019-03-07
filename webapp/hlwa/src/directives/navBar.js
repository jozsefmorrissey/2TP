function navBar() {
  function ctrl($scope, $transitions, $state, configSrvc, errorSrvc, userSrvc,
    searchSrvc, logger) {
    function onChange(trans) {
      $scope.topic = trans && trans.params().topic;
    }

    function updateLogin() {
      $scope.loggedIn = userSrvc.isLoggedIn();
    }

    function search(phrase) {
      searchSrvc.search(phrase, 0, 25);
    }

    function go(sref) {
      $state.go('topic', { topic: sref });
    }

    function isSref(phrase) {
      if (!phrase) {
        return false;
      }
      const matches = phrase.match(/[a-zA-Z0-9]*\.[a-zA-Z0-9.]*/);
      return matches && matches[0].length === phrase.length;
    }

    function logOut() {
      userSrvc.logOut();
    }

    function updateAlert(errors) {
      logger.debug(arguments);
      $scope.errors = errors;
    }

    errorSrvc('nav-alert', updateAlert);
    $scope.logOut = logOut;
    $scope.isSref = isSref;
    $scope.go = go;
    $scope.search = search;
    $transitions.onSuccess({ to: '*' }, onChange);
    userSrvc.onLogin(updateLogin);
  }
  return {
    controller: ctrl,
    templateUrl: 'src/directives/templates/navBar.html',
  };
}

exports.navBar = navBar;
