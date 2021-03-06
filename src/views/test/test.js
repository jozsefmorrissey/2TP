exports.testCtrl = ($scope, webSocket) => {
  function updateContent(content) {
    $('#test-content').val(content);
  }

  function getContent(content) {
    return $('#test-content').val() ? $('#test-content').val() : '';
  }

  function topicChange(topic) {
    webSocket.init(topic, updateContent, getContent);
  }

  function contentChange(content) {
    webSocket.sendRequest();
  }

  $scope.contentChange = contentChange;
  $scope.topicChange = topicChange;
};
