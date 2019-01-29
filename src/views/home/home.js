exports.homeCtrl = ($scope, $http, $transitions, $state) => {
  $scope.msg = 'hello worlds';
  $scope.id = $state.params.id;

  function setChildren(body) {
    $scope.children = body.data;
  }

  function toChildren(child) {
    if ($scope.id) {
      $state.go('home.id', { id: `${$scope.id}.${child}` });
    } else {
      $state.go('home.id', { id: `${child}` });
    }
  }

  function go(child) {
    if ($scope.id) {
      $state.go('topic', { topic: `${$scope.id}.${child}` });
    } else {
      $state.go('topic', { topic: `${child}` });
    }
  }

  function back() {
    if ($scope.id.indexOf('.') !== -1) {
      const id = $scope.id.replace(/(.*)\..*/, '$1');
      $state.go('home.id', { id });
    } else {
      $state.go('home', { });
    }
  }

  function reqTree(trans) {
    if (trans) {
      $scope.id = trans.params().id;
    }
    if ($scope.id === undefined) {
      $scope.id = '';
    }
    $http.get(`http://localhost:3100/topic/children/${$scope.id}`).then(setChildren);
  }

  reqTree();
  $scope.go = go;
  $scope.back = back;
  $scope.toChildren = toChildren;
  $transitions.onSuccess({ to: 'home.id' }, reqTree);
  $transitions.onSuccess({ to: 'home' }, reqTree);
};
