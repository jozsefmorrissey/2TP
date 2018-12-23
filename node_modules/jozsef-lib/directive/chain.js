function chain() {
  function createCover($scope) {
    const div = $('<div></div>');
    div.css({
      position: 'absolute',
      'background-color': $scope.capColor,
      width: '10pt',
      height: '10pt',
      left: `${$scope.startX - 2.5}px`,
      top: `${$scope.startY - 5}px`,
      'z-index': 1,
    });
    return div;
  }


  function ctrl($scope, $element) {
    const linkTemp = '<b>8</b>';
    $element.append(createCover($scope));
    let currY = Number.parseInt($scope.endY) - 15;
    let count = 0;
    while (currY > $scope.startY - 10) {
      const link = $(linkTemp);
      link.attr('id', `link-${count}`);
      link.css({
        position: 'absolute',
        'font-size': '12pt',
        left: `${$scope.startX}px`,
        top: `${currY}px`,
      });
      $element.append(link);
      currY -= 10;
      count += 1;
    }
  }
  return {
    scope: {
      startX: '@',
      startY: '@',
      endX: '@',
      endY: '@',
      capColor: '@',
    },
    controller: ctrl,
  };
}

exports.chain = chain;
