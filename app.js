import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { genSrvc } from './src/services/genSrvc';

import { genDir } from './src/directives/genDir';

import { helloCtrl } from './src/views/hello/hello';
import { goodbyeCtrl } from './src/views/goodbye/goodbye';


angular.module('routerApp', [uiRouter])
  .service('genSrvc', genSrvc)
  .directive('genDir', genDir)
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
    .state('hello', {
      url: '/hello',
      templateUrl: 'src/views/hello/hello.html',
      controller: helloCtrl,
    })
    .state('goodbye', {
      url: '/goodbye',
      templateUrl: 'src/views/goodbye/goodbye.html',
      controller: goodbyeCtrl,
    });

    $urlRouterProvider.otherwise('/hello');
  });
