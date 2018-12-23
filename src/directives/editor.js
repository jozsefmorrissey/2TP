function editor() {
  let id = 0;
  function ctrl($scope, $compile, $element, $timeout, configSrvc, errorSrvc) {
    $scope.id = id;
    id += 1;
    const identifier = $($element).attr('identifier');
    if (identifier) {
      $scope.hasIdentifiers = true;
    }

    $($element).attr('editor-id', $scope.id);

    const tId = `edit-trix-toolbar-${$scope.id}`;
    const eId = `editor-${$scope.id}`;
    $($element).find('trix-toolbar').attr('id', tId);


    function updateContent() {
      const emptyMsg = '<pre>&lt;!-- There is no related  content --&gt;</pre>';
      let content = configSrvc.getTopicInfo($scope.type, $scope.currKey);
      if (content === undefined) {
        content = emptyMsg;
      }
      $(`#${eId}`).val(content);
    }

    function delay() {
      const trixEditor = $(`<trix-editor id='${eId}'
                      toolbar='edit-trix-toolbar-${$scope.id}'
                      angular-trix ng-model="foo"
                      class="trix-content"
                      ng-blur='validate()'
                      ng-focus='onFocus()'></trix-editor>`);
      $($element).find('.curr-tab-container').html(trixEditor);
      $compile(trixEditor)($scope);
      $timeout(updateContent, 250);
    }

    function saveChanges() {
      const value = $(`#${eId}`).val();
      if (value) {
        if ($scope.identifier) {
          if ($scope.currKey) {
            configSrvc.saveTopicInfo(value, $scope.type, $scope.currKey);
          }
        } else {
          configSrvc.saveTopicInfo(value, $scope.type);
        }

        const raw = configSrvc.getTopicRaw($scope.type, $scope.currKey);
        const errors = errorSrvc(raw);
        if (errors.length > 0) {
          $(`#${eId}`).css({'border-color': 'red'});
        } else {
          $(`#${eId}`).css({'border-color': 'grey'});
        }
      }
    }

    function addKey(key) {
      saveChanges();
      $scope.currKey = key;
      const value = $($element).find('.key-input').find('input').val();
      if ($scope.$parent[identifier].indexOf(value) === -1) {
        $scope.$parent[identifier].push(value);
      }
      updateContent();
    }

    window.addEventListener('trix-change', saveChanges);

    function getKeys() {
      return $scope.$parent[identifier];
    }

    // $timeout(delay, 250);
    configSrvc.getTopic().then(delay);
    $scope.addKey = addKey;
    $scope.getKeys = getKeys;
  }
  return {
    scope: {
      hideCode: '@',
      type: '@',
      updateFunc: '@',
      identifier: '@',
      plainText: '@',
    },
    controller: ctrl,
    templateUrl: 'src/directives/templates/editor.html',
  };
}

exports.editor = editor;
