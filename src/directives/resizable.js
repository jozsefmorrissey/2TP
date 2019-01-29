function resizable($document, $timeout) {
  function postLink(scope, $element) {
    const bar = $('<div class="resize-bar"></div>');

    function resize(size) {
      const navHeight = $($element).find(`#${scope.staticId}`).height();
      const minHeight = navHeight + 80;
      const maxHeight = $(window).height() - 50;
      let dx = size;
      dx = dx < minHeight ? minHeight : dx;
      dx = dx > maxHeight ? maxHeight : dx;
      const trixHeight = dx - navHeight;
      $($element).css({
        height: dx,
      });
      $($element).find(`#${scope.scrollId}`).css({
        'max-height': trixHeight,
        overflow: 'scroll',
      });

      const footerHeight = $($(`#${scope.footerId}`).children()[0]).height();
      $(`#${scope.footerId}`).css({ height: dx + footerHeight });
      return false;
    }

    function mousemove($event) {
      return resize($(window).height() - $event.clientY);
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }

    function mouseDown() {
      $document.bind('mousemove', mousemove);
      $document.bind('mouseup', mouseup);
      return false;
    }

    function delayedResize() {
      resize(200);
    }

    const barCss = {
      cursor: 'ns-resize',
      width: '100%',
      padding: '3px',
      'background-color': 'gainsboro',
    };

    bar.css(barCss);
    bar.bind('mousedown', mouseDown);

    $($element).prepend(bar);

    $timeout(delayedResize, 150);
  }

  return {
    restrict: 'A',
    scope: {
      staticId: '@',
      scrollId: '@',
      footerId: '@',
    },
    link: postLink,
  };
}

exports.resizable = resizable;
