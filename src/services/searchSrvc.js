exports.searchSrvc = ($http, $state, stringMapSrvc, errorSrvc) => {
  const scope = {};
  let results = ['std.docker', 'jozsef.bash.confidentalInfo'];
  const onSearchFuncs = [];

  function search(searchPhrase, startIndex, resultCount) {
    function failure() {
      errorSrvc(searchPhrase, 'Failed to get results');
      $state.go('results', { });
    }
    function success(body) {
      results = body.data;
      $state.go('results', { });
      for (let index = 0; index < onSearchFuncs.length; index += 1) {
        onSearchFuncs[index]();
      }
    }

    const searchTerms = Object.keys(stringMapSrvc(searchPhrase));
    // const startIndex = 0;
    // const resultCount = 1;
    $http({
      url: 'http://localhost:3100/info/search',
      method: 'POST',
      data: { searchTerms, startIndex, resultCount },
    })
    .then(success, failure);
  }

  function getResults() {
    return results;
  }

  function onSearch(func) {
    if (typeof func === 'function') {
      onSearchFuncs.push(func);
    }
  }

  scope.onSearch = onSearch;
  scope.getResults = getResults;
  scope.search = search;
  return scope;
};
