const KEYWORD = 'keyword';

exports.hoverSrvc = ($compile, $state, $location, stateSrvc, configSrvc) => {
  const obj = {};
  const loadedContent = {};

  function getKey($element) {
    return $($element).text().trim();
  }

  function getContent($element, id, contentId) {
    switch (contentId) {
      case KEYWORD: {
        const keyword = $($element).text();
        const key = getKey($element);
        if (keyword) {
          if (!loadedContent[key]) {
            loadedContent[key] = {};
          }
          loadedContent[key].data = configSrvc.getTopicHtml('keywords', key);
          return Promise.resolve();
        }

        throw new Error(`${$($element).text()} is an undefined keyword for topic ${stateSrvc.getState()}.`);
      }
      default: {
        throw new Error(`Content type '${contentId}' is not defined.`);
      }
    }
  }

  function getContainer($element, id, scope, name) {
    const key = getKey($element);
    if (!loadedContent[key][name]) {
      let content;
      switch (name) {
        default:
          content = $(`<div class="hover-outer" id='${id}' ng-click='$event.stopPropagation()'>
                        <button class='hover-close-btn' ng-click='close("${id}")'>X</button>
                        <div class='hover-inner'>
                          ${loadedContent[key].data}
                        </div>
                      </div>`);
      }
      loadedContent[key][name] = id;
      $('body').append(content);
      $(`#${id}`).hide();
    }

    loadedContent[key].data = configSrvc.getTopicHtml('keywords', key);
    $(`#${id}`).find('.hover-inner').html(loadedContent[key].data);
    $compile($(`#${id}`))(scope);
    return loadedContent[key][name];
  }

  obj.getContainer = getContainer;
  obj.getContent = getContent;
  return obj;
};
