exports.editCtrl = ($scope, $transitions, $timeout, promiseSrvc, userSrvc,
      editSrvc, configSrvc, eventSrvc) => {
  $scope.KEYWORD = editSrvc.KEYWORD;
  $scope.CONTENT = editSrvc.CONTENT;
  $scope.DATA = editSrvc.DATA;
  $scope.LINK = editSrvc.LINK;
  $scope.CSS = editSrvc.CSS;
  $scope.tab = $scope.CONTENT;
  $scope.intOex = 'external';

  function setup() {
    $scope.showEditor = !configSrvc.hasContent();
    $scope.keywords = configSrvc.getKeywords();
    $scope.links = [];
    const links = configSrvc.getLinks();
    const keys = Object.keys(links);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      const url = links[key];
      $scope.links[index] = { key, url };
    }
  }

  function init() {
    promiseSrvc.on(promiseSrvc.types.ALL_COMPLETE, configSrvc.getUpdateEvent('content'), setup);
  }

  function saveLinks() {
    const linkObj = {};
    for (let index = 0; index < $scope.links.length; index += 1) {
      const link = $scope.links[index];
      linkObj[link.key] = link.url;
    }
    configSrvc.saveTopicInfo(linkObj, 'links');
  }

  function updateState(newState) {
    $scope.tab = newState;
  }

  function hasKeywords() {
    return $scope.keywords.length > 0;
  }

  function addLink() {
    $scope.links.push({});
  }

  function closeAddKeyword() {
    $scope.newKeyword = false;
  }

  function addKeyword() {
    const keyword = $('#keyword').val();
    if (keyword) {
      $scope.keywords.push(keyword);
      closeAddKeyword();
      $('#keyword').val('');
      $scope.keywords.sort();
    } else {
      $scope.newKeyword = true;
    }
  }

  function shorten(word, length) {
    if (word.length < length + 3) {
      return word;
    }

    return `${word.substr(0, length)}...`;
  }

  function save(comment) {
    if (userSrvc.isLoggedIn()) {
      configSrvc.save(comment);
    } else {
      $scope.notLoggedIn = true;
    }
  }

  function hide() {
    $scope.showEditor = false;
  }

  function toggleEditor() {
    $scope.showEditor = !$scope.showEditor;
  }

  $('#edit-toggle').click(toggleEditor);

  $transitions.onSuccess({ to: 'topic' }, init);
  $transitions.onBefore({ to: 'topic' }, hide);
  eventSrvc.on(configSrvc.getUpdateEvent('web-socket'), setup);

  init();
  $scope.save = save;
  $scope.updateState = updateState;
  $scope.shorten = shorten;
  $scope.closeAddKeyword = closeAddKeyword;
  $scope.addKeyword = addKeyword;
  $scope.hasKeywords = hasKeywords;
  $scope.saveLinks = saveLinks;
  $scope.hide = hide;
  $scope.addLink = addLink;
};
