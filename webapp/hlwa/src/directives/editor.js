function editor() {
  let id = 0;
  function ctrl($scope, $compile, $element, $timeout, configSrvc, eventSrvc,
    promiseSrvc, errorSrvc, logger) {
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
      let key = $scope.currKey;
      if ($scope.identifier && key === undefined) {
        key = '';
      }
      let content = configSrvc.getTopicInfo($scope.type, key);
      if (content === undefined) {
        content = emptyMsg;
      }
      const jqObj = $(`#${eId}`);
      if (jqObj && jqObj[0]) {
        let offset = 0;
        if (jqObj[0].editor.selectionManager.currentLocationRange) {
          offset = jqObj[0].editor.selectionManager.currentLocationRange[0].offset;
        }
        logger.debug({ offset, content, key });
        jqObj.val(content);
        jqObj[0].editor.setSelectedRange(offset);
        jqObj.focus();
      }
    }

    let initialize = true;
    function delay() {
      if (initialize) {
        eventSrvc.on(configSrvc.getUpdateEvent('web-socket'), updateContent);
        const trixEditor = $(`<trix-editor id='${eId}'
                        toolbar='edit-trix-toolbar-${$scope.id}'
                        angular-trix ng-model="foo"
                        class="trix-content"
                        ng-blur='validate()'
                        ng-focus='onFocus()'></trix-editor>`);
        $($element).find('.curr-tab-container').html(trixEditor);
        $compile(trixEditor)($scope);
        $timeout(updateContent, 250);
        initialize = false;
      }
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
          $(`#${eId}`).css({ 'border-color': 'red' });
        } else {
          $(`#${eId}`).css({ 'border-color': 'grey' });
        }
      }
    }

    function focus() {
      $('#editor-2')[0].editor.setSelectedRange(23, 5);
      $(`#${eId}`).focus();
    }

    function addKey(key) {
      logger.debug(arguments);
      saveChanges();
      $scope.currKey = key;
      const value = $($element).find('.key-input').find('input').val();
      if ($scope.$parent[identifier].indexOf(value) === -1) {
        logger.debug('Added');
        $scope.$parent[identifier].push(value);
      }
      updateContent();
    }

    window.addEventListener('trix-change', saveChanges);

    function getKeys() {
      return $scope.$parent[identifier];
    }

    promiseSrvc.on(promiseSrvc.types.ALL_COMPLETE, configSrvc.getUpdateEvent(), delay);

    $scope.addKey = addKey;
    $scope.getKeys = getKeys;
    $scope.focus = focus;
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
