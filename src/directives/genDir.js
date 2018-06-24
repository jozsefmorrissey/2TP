function genDir() {
  return {
    scope: {
      name: '@',
      address: '@',
    },
    templateUrl: 'src/directives/templates/genDir.html',
  };
}

exports.genDir = genDir;
