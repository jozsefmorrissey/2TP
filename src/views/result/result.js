exports.resultCtrl = ($scope, $state, searchSrvc, $transitions) => {
  function setResults() {
    $scope.results = searchSrvc.getResults();
  }

  function go(sref) {
    $state.go('topic', { topic: sref });
  }

  $transitions.onSuccess({ to: 'results' }, setResults);
  setResults();
  searchSrvc.onSearch(setResults);
  $scope.go = go;
};
