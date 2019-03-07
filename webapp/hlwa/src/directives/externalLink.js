function externalLink(configSrvc, logger) {
  function ctrl($scope, $element, $compile) {
    const keyword = $element.text();
    const url = configSrvc.getLinks()[keyword];
    const link = $(`<a target='_blank' href='${url}'>${keyword}</a>`);
    logger.debug(`ExternalLink created: ${keyword}`);
    $($element).html(link);
    $compile(link)($scope);
  }
  return {
    controller: ctrl,
  };
}

exports.externalLink = externalLink;
