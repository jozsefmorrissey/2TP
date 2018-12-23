function drawBridge(LazyLoad) {

  function getChain(x, y, height, color) {
    return `<chain start-y='${y}' start-x='${x}' end-y='${height + y}' end-x='${x}' cap-color='${color}'></chain>`;
  }

  function removeChains($element) {
    $($element).find('chain').each(function () {
      $(this).remove();
    });
  }

  const inc =  7;
  function setElemCss($scope, $element, color) {
    if ($scope.open) {
      $scope.displayH += inc;
    } else {
      $scope.displayH -= inc;
    }
    $($element).css({
      'border-bottom': color,
      'border-bottom-style': 'ridge',
      'border-width': '8px',
      margin: '20pt',
      'position': 'relative',
      height: `${$scope.displayH}px`,
      overflow: 'hidden',
    });
  }

  function getChildHeight($element) {
    let height = 0;
    $($element).children().each(function () {
      height += $(this).height();
    });

    return height;
  }

  function callSetChains($scope, $element, $compile, myId, flip) {
    function call() {
      let id = myId;
      if (flip) {
        $scope.aliveId += 1;
        id = $scope.aliveId;
        $scope.open = !$scope.open;
      }
      setChains($scope, $element, $compile, id);
    }

    return call;
  }

  function initChain($scope, $compile, $element, chain) {
    function init() {
      setChains($scope, $element, $compile, ++$scope.aliveId);
    }

    return init;
  }

  function setChains($scope, $element, $compile, myId) {
    if ($scope.aliveId === myId) {
      removeChains($element);
      setElemCss($scope, $element, $scope.capColor);
      const jqObj = $($element);
      const contents = $('<div class="content-wapper"></div>').wrap(jqObj);
      const height = jqObj.height();
      const width = jqObj.width();
      const x = 2.5;//jqObj.position().left;
      const y = 5;//jqObj.position().top;
      const chain1 = getChain(x, y, height, $scope.capColor);
      const chain2 = getChain(x + width - 10, y, height, $scope.capColor);


      // jqObj.html($compile(contents)($scope));
      jqObj.append($compile(chain1)($scope));
      jqObj.append($compile(chain2)($scope));
      if(($scope.displayH < getChildHeight($element) + 10 && $scope.open) ||
          ($scope.displayH > $($($element).children()[0]).height() + 10 && !$scope.open)) {
        setTimeout(callSetChains($scope, $element, $compile, myId), [50]);
      }
    }
  }

  function ctrl($scope, $element, $compile) {
    $scope.aliveId = 0;
    // setChains($scope, $compile, $element, null, true);
    setTimeout(callSetChains($scope, $element, $compile, ++$scope.aliveId), [100]);

    $scope.displayH = $($($element).children()[0]).height() + 20;

    // $scope.$watch($element, callSetChains);

    $($($element).children()[0]).click(callSetChains($scope, $element, $compile, null, true));
  }
  return {
    scope: {
      capColor: '@',
    },
    restrict: 'A',
    controller: ctrl,
  };
}

exports.drawBridge = drawBridge;
