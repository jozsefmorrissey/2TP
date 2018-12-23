function editJson() {
  function ctrl($scope, $element, $compile, $timeout) {
    function ignore(key) {
      return key.indexOf('$') === 0;
    }
    $scope.ignore = ignore;
    $scope.showObj = {};
    $scope.edit = {};

    function setType(obj) {
      if (typeof obj === 'object') {
        if (obj instanceof Array) {
          $scope.type = 'array';
          $scope.array = obj;
        } else {
          $scope.type = 'object';
          $scope.keys = Object.keys(obj);
        }
      } else {
        $scope.value = obj;
      }
    }

    function toggleEdit(key) {
      $scope.edit[key] = !$scope.edit[key];
      $scope.doubleClicked = true;
    }

    function toggleShowObj(key) {
      function delayed() {
        if (!$scope.doubleClicked) {
          $scope.showObj[key] = !$scope.showObj[key];
        }
      }
      $timeout(delayed, 500);
    }

    $scope.toggleEdit = toggleEdit;
    $scope.toggleShowObj = toggleShowObj;

    $scope.links = $scope.$parent.links;
    const evaled = eval(`$scope.${$scope.path}`);
    setType(evaled);
  }
  return {
    scope: {
      path: '@',
    },
    controller: ctrl,
    templateUrl: 'src/directives/templates/editJson.html',
  };
}

exports.editJson = editJson;
