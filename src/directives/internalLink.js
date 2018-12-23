function internalLink(configSrvc, $state, stateSrvc) {
  function ctrl($scope, $element, $compile) {
    const keyword = $element.text();
    const sref = configSrvc.getLinks()[keyword];
    const link = $(`<a ng-click='intGo()'>${keyword}</a>`);
    $($element).html(link);
    $compile(link)($scope);

    function intGo() {
      stateSrvc.go(sref);
    }
    $scope.intGo = intGo;
  }
  return {
    controller: ctrl,
  };
}

exports.internalLink = internalLink;
