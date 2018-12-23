function book() {
  function ctrl($scope, $element, $compile) {
    $scope.pages = [];

    function savePages() {
      function savePage() {
        $scope.pages.push($(this).html());
      }

      $(`.${$scope.sectionClass}`).each(savePage);
    }

    function getTurnPage(clickedPage, backCover) {
        let content;
        if (clickedPage >= $scope.pages.length && !backCover) {
          content = getBackCover(clickedPage + 1);
        } else if (clickedPage === 1) {
          content = getFrontCover();
        } else if (clickedPage % 2 === 0 && !backCover) {
          content = $('<div class="book-cover-inside"></div>');
          content.append(getPage(clickedPage + 1));
          content.append(getPage(clickedPage + 2));
        } else {
          content = $('<div class="book-cover-inside"></div>');
          content.append(getPage(clickedPage - 2));
          content.append(getPage(clickedPage - 1));
        }
        $($element).html($compile(content)($scope));
    }

    function getFrontCover() {
      return `  <div class='book-outer book-left' ng-click='getTurnPage(0)'>
                  <div class='book-binding'></div>
                  <div class='book-cover'>
                    <div class='center center-vertical'>
                      <b class='book-title'>A Pleasurable Conquest</b>
                      <br>
                      <b class='book-author'>By Jozsef Morrissey</b>
                    </div>
                  </div>
                </div>`;
    }

    function getBackCover(page) {
      return `  <div class='book-outer' ng-click='getTurnPage(${page}, true)'>
                  <div class='book-binding'></div>
                  <div class='book-cover'>
                    <div class='center center-vertical'>
                      About the Autor!
                    </div>
                  </div>
                </div>`;
    }

    function getPage(number) {
      let pages = number * 1;
      let pageClass = 'book-page-left';
      let borderClass = 'right-border-thin';
      if (number % 2 === 0) {
        borderClass = 'left-border-thin';
        pageClass = 'book-page-right';
      }

      let divTemplate = `<div class="${pageClass}"></div>`;
      let page = $(divTemplate).html(`<div class='large-padding'>
                                        ${$scope.pages[number - 1]}
                                      </div>`);
      for (let count = 0; count < pages; count++) {
        page = $(divTemplate).html(page);
      }
      let side = 'book-right';
      return $(`<div class='book-outer ${borderClass}' ng-click='getTurnPage(${number})'></div>`).html(page);
    }


    $scope.getTurnPage = getTurnPage;
    savePages();
    getTurnPage(1);
  }
  return {
    scope: {
      titleId: '@',
      backId: '@',
      sectionClass: '@',
    },
    controller: ctrl,
  };
}

exports.book = book;
