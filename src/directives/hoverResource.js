let hoverCount = 0;
function hoverResource(hoverSrvc) {
  function hideAll() {
    $('.hover-outer').hide();
  }
  $(document).click(hideAll);

  function ctrl($scope, $element) {
    $scope.show = false;
    const id = hoverCount;
    hoverCount += 1;
    const switchId = `hover-switch-${id}`;
    let hoverId = `hover-resource-${id}`;
    $($element).attr('id', switchId);
    let content;

    function close(elemId) {
      $(`#${elemId}`).hide();
    }

    function compileContent() {
      hoverId = hoverSrvc.getContainer($element, hoverId, $scope);
      content = $(`#${hoverId}`);
      $scope.close = close;
    }

    hoverSrvc.getContent($element, hoverId, 'keyword').then(compileContent);

    function positionText() {
      const offset = $(`#${switchId}`).offset();
      const height = $(`#${switchId}`).height();
      const screenWidth = $(window).width();
      const top = `${offset.top + height}px`;
      const calcWidth = offset.left + 10 < screenWidth / 2 ? offset.left + 10 : screenWidth / 2;
      const left = `${calcWidth}px`;

      const width = `${screenWidth - calcWidth - 10}px`;
      content.css({
        cursor: 'pointer',
        position: 'absolute',
        left,
        width,
        top,
      });
      compileContent();
    }

    function hoverOn() {
      $(`#${switchId}`).toggleClass('link');
    }

    function hoverOff() {
      $(`#${switchId}`).toggleClass('link');
    }

    $scope.hoverOn = hoverOn;
    $scope.hoverOff = hoverOff;

    function onSwitch($event) {
      if ($(`#${hoverId}`).is(':visible')) {
        $(`#${hoverId}`).hide();
      } else {
        positionText();
        $(`#${hoverId}`).show();
      }
      $event.stopPropagation();
    }

    $(`#${switchId}`).click(onSwitch);

    $(`#${switchId}`).css('cursor', 'pointer');
  }

  return {
    controller: ctrl,
  };
}

exports.hoverResource = hoverResource;
