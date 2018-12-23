exports.configSrvc = ($http, $state, stateSrvc, errorSrvc) => {
  const obj = {};
  let config;
  let topic;
  let topicPromise;
  const updateFuncs = {};

  function onUpdate(attr, func) {
    if (!updateFuncs[attr]) {
      updateFuncs[attr] = [];
    }
    updateFuncs[attr].push(func);
  }

  function runUpdateFuncs(attr) {
    const list = updateFuncs[attr.toLowerCase()];
    if (list) {
      for (let index = 0; index < list.length; index += 1) {
        list[index]();
      }
    }
  }

  function setTopic(resp) {
    topic = resp.data;
  }

  function getTopic() {
    return topicPromise;
  }

  function getTopics() {
    if (config) {
      return Object.keys(config);
    }

    return undefined;
  }

  function toHtml(mix) {
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
    if (key) {
      ret = topic[attr.toLowerCase()][key];
    } else {
      ret = topic[attr.toLowerCase()];
    }
    if (typeof ret === 'object') {
      return JSON.stringify(ret, null, 2);
    }
    return ret;
  }

  function getTopicRaw(attr, key) {
    return getTopicInfo(attr, key).replace(/<.*?>|&.*?;/g, '');
  }

  function getTopicHtml(attr, key) {
    const raw = getTopicRaw(attr, key);
    if (raw.indexOf('@') === 0) {
      return getTopicHtml(attr, raw.substr(1));
    }
    return toHtml(getTopicInfo(attr, key));
  }

  function getTopicJson(attr, key) {
    const jsonStr = getTopicRaw(attr, key);
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      errorSrvc(jsonStr, 'Invalid json object');
    }
    return undefined;
  }

  function equateTypeOf(type1, type2) {
    let newVal = type1;
    if (typeof type2 === 'object' && typeof type1 === 'string') {
      newVal = JSON.parse(type1.replace(/ /g, ''));
    } else if (typeof type2 === 'string' && typeof type1 === 'object') {
      newVal = JSON.stringify(type1);
    }

    return newVal;
  }

  function saveTopicInfo(value, attr, key) {
    if (key) {
      topic[attr.toLowerCase()][key] = value;
    } else {
      topic[attr.toLowerCase()] = value;
    }
    runUpdateFuncs(attr);
  }

  function keywordContent(keyword) {
    return topic.keywords[keyword];
  }

  function getKeywords() {
    if (topic) {
      return Object.keys(topic.keywords);
    }

    return undefined;
  }

  function getLinks() {
    return topic.links;
  }

  function getCss() {
    return topic.css;
  }

  function hasContent() {
    const topics = getTopics();
    return topics && topics.indexOf(stateSrvc.getPath()) > -1;
  }

  function getSref(key) {
    return config.srefs[key];
  }

  function save() {
    function success() {
      console.log('success');
    }
    function failure() {
      console.log('failure');
    }
    $http({
      url: `http://localhost:3100/${stateSrvc.getState()}`,
      method: 'POST',
      data: topic,
    })
    .then(success, failure);
  }

  function init() {
    topicPromise = $http.get(`http://localhost:3100/${stateSrvc.getState()}`);
    topicPromise.then(setTopic);
  }

  init();
  stateSrvc.onChange(init);

  obj.getSref = getSref;
  obj.getTopics = getTopics;
  obj.getKeywords = getKeywords;
  obj.keywordContent = keywordContent;
  obj.getTopic = getTopic;
  obj.saveTopicInfo = saveTopicInfo;
  obj.getTopicInfo = getTopicInfo;
  obj.getCss = getCss;
  obj.getTopicJson = getTopicJson;
  obj.getTopicRaw = getTopicRaw;
  obj.getTopicHtml = getTopicHtml;
  obj.getLinks = getLinks;
  obj.hasContent = hasContent;
  obj.save = save;
  obj.onUpdate = onUpdate;
  return obj;
};
