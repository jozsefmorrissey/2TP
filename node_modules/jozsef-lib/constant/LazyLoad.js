let loader = {};

function loadFromUrl(appName, url) {
  jQuery.get(url,
    function (data) {
      console.log(data);
      loadFromString(appName, data);
    });
}

function loadFromString(appName, string) {
  console.log(string);
  eval(`let ${appName} = loader;${string}`);
}

function buildLoader ($provide, $controllerProvider, $animateProvider,
  $filterProvider, $compileProvider) {
  loader.service = $provide.service;
  loader.factory = $provide.factory;
  loader.value = $provide.value;
  loader.constant = $provide.constant;
  loader.controller = $controllerProvider.register;
  loader.animate = $animateProvider.register;
  loader.filter = $filterProvider.register;
  loader.directive = $compileProvider.directive;
  loader.loadFromString = loadFromString;
  loader.loadFromUrl = loadFromUrl;
}

angular.module('jozsefLib')
  .config(buildLoader);

function LazyLoad () {
  console.log("lazyloader up!")
  return loader;
}

exports.LazyLoad = loader;
