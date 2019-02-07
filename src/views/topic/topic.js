exports.topicCtrl = ($scope, $rootScope, $state, $compile, $injector,
    configSrvc, eventSrvc, domAop, $transitions, promiseSrvc) => {
  function longestFirst(a, b) {
    return b.length - a.length;
  }

  function surroundWord(jqObj, word, htmlStr) {
    let html = `>> ${jqObj.html()} <<`;
    html = html.replace(/\n/g, ' ');
    const escWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let wordReg = `(>[^>^<]{1,})${escWord}([^>^<]*<)`;
    while (html.match(wordReg)) {
      const jqSurrounded = $(htmlStr).text(word);
      html = html.replace(new RegExp(wordReg, 'g'), `$1${jqSurrounded[0].outerHTML}$2`);
      jqObj.html(html.substr(2, html.length - 4));
    }
    wordReg = `(>[^>^<]*)${escWord}([^>^<]{1,}<)`;
    while (html.match(wordReg)) {
      const jqSurrounded = $(htmlStr).text(word);
      html = html.replace(new RegExp(wordReg, 'g'), `$1${jqSurrounded[0].outerHTML}$2`);
      jqObj.html(html.substr(2, html.length - 4));
    }
  }

  function toLower(match) {
    return match.substr(1).toUpperCase();
  }

  function setKeywords(keywords, directive) {
    const directiveId = directive.replace(/-(.)/g, toLower);

    function onHover(elem) {
      const jqElem = $(elem);
      if (!jqElem.attr(directiveId)) {
        for (let index = 0; index < keywords.length; index += 1) {
          const word = keywords[index];
          surroundWord(jqElem, word, `<${directive}></${directive}>`);
        }
        if ($(elem).html().indexOf(`<${directive}>`) > -1) {
          $compile(elem)($scope);
        }
        jqElem.attr(directiveId, true);
      }
    }

    if ($injector.has(`${directiveId}Directive`)) {
      domAop.hover('h1,h2,h3,h4,h5,u,i,b,p,h,zd', onHover, 'topic-aop');
    } else {
      throw new Error(`${directive} is not a valid Directive`);
    }
  }

  function shortDesc() {
    domAop.reset('topic-aop');
    const keywords = configSrvc.getAllKeywords().sort(longestFirst);
    setKeywords(keywords, 'hover-resource');

    const links = configSrvc.getLinks();
    const split = { internal: [], external: [] };
    const keys = Object.keys(links);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      const link = links[key];
      if (link && link.indexOf('/') === -1) {
        split.internal.push(key);
      } else {
        split.external.push(key);
      }
    }
    setKeywords(split.internal.sort(longestFirst), 'internal-link');
    setKeywords(split.external.sort(longestFirst), 'external-link');
  }

  function updateData() {
    const data = configSrvc.getTopicJson('data');
    if (data) {
      const keys = Object.keys(data);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        $scope[key] = data[key];
      }
    }
  }

  function cssUpdate() {
    const css = configSrvc.getTopicRaw('css');
    $('#user-css').text(css);
  }

  function updateContent() {
    const testDiv = $('<div></div>');
    try {
      testDiv.html(configSrvc.getTopicHtml('content'));
      $compile(testDiv)($scope);
      const elem = $('#main-content');
      elem.html(configSrvc.getTopicHtml('content'));
      $compile(elem)($scope);
      cssUpdate();
    } catch (e) {
      $scope.compileError = e;
    }
  }

  function displayUpdate() {
    updateData();
    shortDesc();
    updateContent();
    if (!$scope.$$phase) {
      $scope.$apply();
    }
  }

  function go(topic) {
    $state.go('topic', { topic });
  }

  function init() {
    $scope.domain = window.location.href.replace(/(.*\/\/.*)\/.*/, '$1');
    $scope.currPort = window.location.href.replace(/.*:([0-9]*).*/, '$1');
  }

  function transition() {
    init();
    return true;
  }

  $transitions.onSuccess({ to: '*' }, transition);

  promiseSrvc.on(promiseSrvc.types.ALL_COMPLETE, configSrvc.getUpdateEvent('config'), displayUpdate);

  eventSrvc.on(configSrvc.getUpdateEvent(), displayUpdate);


  init();
  $scope.go = go;
};
