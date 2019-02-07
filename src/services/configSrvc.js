exports.configSrvc = ($http, $state, $stateParams, $transitions, $cookies, $timeout,
    errorSrvc, stringMapSrvc, Hash, userSrvc, eventSrvc, promiseSrvc,
    projectPropertySrvc, webSocket) => {
  const scope = {};
  let topicInfo;
  let serverTopicInfo;

  scope.EVENT = 'config-update';

  function getState() {
    return $stateParams.topic;
  }

  let updatePending = false;
  function getUpdateEvent(attr) {
    if (attr) {
      return `${scope.EVENT}-${attr.toLowerCase()}`;
    }
    return scope.EVENT;
  }

  function contentChange() {
    webSocket.sendRequest();
  }

  function runUpdateFuncs() {
    function triggerUpdate() {
      eventSrvc.trigger(getUpdateEvent(), topicInfo);
      updatePending = false;
      contentChange();
    }

    if (!updatePending) {
      $timeout(triggerUpdate, 3000);
    }
    updatePending = true;
  }

  function initObject(id) {
    if (typeof topicInfo[id] !== 'object') {
      topicInfo[id] = {};
    }
  }

  function updateContent(content) {
    if (typeof content === 'object') {
      topicInfo = content;
    } else {
      topicInfo = JSON.parse(content);
    }

    initObject('keywords');
    initObject('inheritedKeywords');
    initObject('links');

    eventSrvc.trigger(getUpdateEvent('web-socket'), topicInfo);
    runUpdateFuncs();
  }

  function getContent() {
    return JSON.stringify(topicInfo);
  }


  function connect() {
    function connectToSocket() {
      webSocket.init(getState(), updateContent, getContent);
    }
    projectPropertySrvc.onLoad(connectToSocket);
  }

  function saveUserVersion() {
    // const user = userSrvc.getUser();
    // const userVersion = {
      //   jsonObj: JSON.stringify(topicInfo),
      //   id: { pageIdentifier: getState() }
      // };
    // const data = {
    //   url: 'http://localhost:9999/version/update',
    //   method: 'POST',
    //   data: { user, userVersion },
    // };
    // function onError() {
    //   errorSrvc(data.url, 'Failed to save user Data.');
    // }
    // $http(data).then(undefined, onError);
  }

  function getPath() {
    return getState().replace(/\./g, '/');
  }

  function indicateChange() {
    if (Hash(topicInfo) !== Hash(serverTopicInfo)) {
      errorSrvc('nav-alert', 'Unsaved content');
    } else {
      errorSrvc('nav-alert', null);
    }
  }

  function setTopic(resp) {
    if (resp[0] && resp[0].data && resp[0].status === 200) {
      topicInfo = resp[0].data;
    } else if (resp[1] && resp[1].data) {
      topicInfo = resp[1].data;
    } else {
      topicInfo = {};
    }
    initObject('keywords');
    initObject('inheritedKeywords');
    initObject('links');

    indicateChange();
    serverTopicInfo = JSON.parse(JSON.stringify(resp[1].data));
  }

  function toHtml(mixedContent) {
    if (mixedContent === undefined) {
      return undefined;
    }
    let mix = mixedContent.replace(/<(div|li)>/g, '<$1><zd>');
    mix = mix.replace(/<\/(div|li)>/g, '</zd></$1>');
    const htmlArr = mix.replace(/(<pre>)|<\/pre>/g, '!!$1').split('!!');
    let html = '';
    for (let index = 0; index < htmlArr.length; index += 1) {
      let currHtml = htmlArr[index];
      if (currHtml.indexOf('<pre>') === 0) {
        currHtml = $('<div></div>').html(currHtml.substring(5)).text();
      }
      html += currHtml;
    }
    return html;
  }

  function getTopicInfo(attr, key) {
    let ret;
    if (key !== undefined) {
      ret = topicInfo[attr.toLowerCase()][key];
    } else {
      ret = topicInfo[attr.toLowerCase()];
    }
    if (typeof ret === 'object') {
      return JSON.stringify(ret, null, 2);
    }
    return ret;
  }

  function getTopicRaw(attr, key) {
    const info = getTopicInfo(attr, key);
    if (info !== undefined) {
      return info.replace(/<.*?>|&.*?;/g, '');
    }
    return undefined;
  }

  function getTopicHtml(attr, key) {
    const raw = getTopicRaw(attr, key);
    if (raw && raw.indexOf('@') === 0) {
      return getTopicHtml(attr, raw.substr(1));
    }
    return toHtml(getTopicInfo(attr, key));
  }

  function getTopicJson(attr, key) {
    const jsonStr = getTopicRaw(attr, key);
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      errorSrvc(jsonStr, 'Invalid json scope.ct');
    }
    return undefined;
  }

  function saveTopicInfo(value, attr, key) {
    if (key !== undefined) {
      topicInfo[attr.toLowerCase()][key] = value;
    } else {
      topicInfo[attr.toLowerCase()] = value;
    }
    indicateChange();
    runUpdateFuncs(attr);
    saveUserVersion();
  }

  function keywordContent(keyword) {
    return topicInfo.keywords[keyword];
  }

  function getKeywords() {
    if (topicInfo) {
      return Object.keys(topicInfo.keywords).sort();
    }

    return undefined;
  }

  function getAllKeywords() {
    let keywords = getKeywords();
    const inheritedKeywords = Object.keys(topicInfo.inheritedKeywords);
    keywords = keywords.concat(inheritedKeywords);
    keywords.sort();
    return keywords;
  }

  function getKeywordHtml(key) {
    const html = getTopicHtml('keywords', key);
    if (html) {
      return html;
    }

    return getTopicHtml('inheritedKeywords', key);
  }

  function getLinks() {
    return topicInfo.links;
  }

  function getCss() {
    return topicInfo.css;
  }

  function hasContent() {
    return topicInfo.content;
  }

  function save(comment) {
    function failure() {
      errorSrvc(topicInfo, 'Failed to save');
    }

    const map = stringMapSrvc(JSON.stringify(topicInfo));
    $http({
      url: `http://localhost:3100/${getState()}`,
      method: 'POST',
      data: { body: topicInfo, comment, map, username: userSrvc.getUser().name },
    })
    .then(undefined, failure);
  }

  function clear(trans) {
    const topic = trans.params().topic;
    const user = userSrvc.getUser();
    const url = projectPropertySrvc.getRestEndPointUrl('ENDPOINT_PAGE');
    const currentTopicPromise = $http.get(`${url}/${topic}`);
    let userTopicPromise;
    if (user) {
      userTopicPromise = $http.get(`http://localhost:9999/version/${user.email}/${topic}`);
    } else {
      userTopicPromise = Promise.resolve();
    }

    promiseSrvc.create(promiseSrvc.types.ALL_COMPLETE, scope.EVENT,
          [userTopicPromise, currentTopicPromise], setTopic);
  }

  let initialize = true;
  function init(trans) {
    if (initialize) {
      projectPropertySrvc.onLoad(() => {
        clear(trans);
        initialize = false;
      });
    }
  }

  $transitions.onSuccess({ to: '*' }, init);
  $transitions.onSuccess({ to: '*' }, connect);
  $transitions.onBefore({ to: '*' }, clear);

  scope.getAllKeywords = getAllKeywords;
  scope.getKeywords = getKeywords;
  scope.getKeywordHtml = getKeywordHtml;
  scope.keywordContent = keywordContent;
  scope.saveTopicInfo = saveTopicInfo;
  scope.getTopicInfo = getTopicInfo;
  scope.getCss = getCss;
  scope.getTopicJson = getTopicJson;
  scope.getTopicRaw = getTopicRaw;
  scope.getTopicHtml = getTopicHtml;
  scope.getLinks = getLinks;
  scope.hasContent = hasContent;
  scope.save = save;
  scope.getUpdateEvent = getUpdateEvent;
  scope.getState = getState;
  scope.getPath = getPath;
  return scope;
};
