exports.requestSrvc = ($http, envConfig) => {
  const scope = {};
  const domain = envConfig.enviroments[envConfig.env].serverDomain;

  function post(url, success, error, data) {
    const request = {
      method: 'POST',
      url: `${domain}${url}`,
      data,
    };

    $http(request).then(success, error);
  }

  scope.post = post;
  return scope;
};
