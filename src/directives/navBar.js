function navBar($window, $timeout, UtilSrvc, stateSrvc) {
  let width;
  let element;
  let scope;
  let count = 1;

  function go(index) {
    stateSrvc.go(index);
  }

  function resize() {
    if (width !== $window.innerWidth) {
      width = $window.innerWidth;
      const maxWidth = width;
      const button = $($(element).find('.nav-link')[0]).parent();
      const buttonWidth = button.outerWidth() ? button.outerWidth() : 101;
      count = 0;
      let totalWidth = buttonWidth * 2;
      while (totalWidth < maxWidth) {
        count += 1;
        totalWidth += buttonWidth;
      }
      if (button.outerWidth() === null) {
        $timeout(resize, 250);
      }
      // $scope.$digest();
    }
  }

  function setLinks() {
    resize();
    scope.nav.pages = stateSrvc.getRange(count);
    scope.currIndex = stateSrvc.getIndex();
  }

  function ctrl($scope, $element) {
    element = $element;
    $scope.nav = {};
    $scope.nav.pages = ['one'];
    scope = $scope;
    $scope.go = go;
    setLinks();
    stateSrvc.onChange(setLinks);
  }

  function link() {
    width = $window.innerWidth;
    angular.element($window).bind('resize', setLinks);
  }

  return {
    scope: {
      name: '@',
      address: '@',
    },
    controller: ctrl,
    link,
    templateUrl: 'src/directives/templates/navBar.html',
  };
}

exports.navBar = navBar;
