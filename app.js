import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';

// Constants
import { envConfig } from './src/constants/envConfig';
import { urlConfig } from './src/constants/urlConfig';

import { unique } from './src/filters/unique';

import { hoverResource } from './src/directives/hoverResource';
import { navBar } from './src/directives/navBar';
import { internalLink } from './src/directives/internalLink';
import { externalLink } from './src/directives/externalLink';
import { resizable } from './src/directives/resizable';
import { editor } from './src/directives/editor';

import { configSrvc } from './src/services/configSrvc';
import { hoverSrvc } from './src/services/hoverSrvc';
import { editSrvc } from './src/services/editSrvc';
import { errorSrvc } from './src/services/errorSrvc';
import { userSrvc } from './src/services/userSrvc';
import { eventSrvc } from './src/services/eventSrvc';
import { Hash } from './src/services/Hash';
import { requestSrvc } from './src/services/requestSrvc';
import { searchSrvc } from './src/services/searchSrvc';
import { promiseSrvc } from './src/services/promiseSrvc';
import { webSocket } from './src/services/webSocket';
import { stringMapSrvc } from './src/services/stringMapSrvc';
import { projectPropertySrvc } from './src/services/projectPropertySrvc';


import { homeCtrl } from './src/views/home/home';
import { resetCtrl } from './src/views/reset/reset';
import { topicCtrl } from './src/views/topic/topic';
import { loginCtrl } from './src/views/login/login';
import { revisionsCtrl } from './src/views/revisions/revisions';
import { editCtrl } from './src/views/edit/edit';
import { resultCtrl } from './src/views/result/result';
import { testCtrl } from './src/views/test/test';

const jozsefLib = require('jozsef-lib');
require('angular-trix');

console.log("aarguments" + process.argv)

function whiteList($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    'http://localhost:3100/',
  ]);
}

angular.module('routerApp', [uiRouter, ngCookies, jozsefLib, 'angularTrix'])
  .filter('unique', unique)
  .constant('envConfig', envConfig)
  .constant('urlConfig', urlConfig)
  .directive('hoverResource', hoverResource)
  .directive('navBar', navBar)
  .directive('internalLink', internalLink)
  .directive('externalLink', externalLink)
  .directive('resizable', resizable)
  .directive('editor', editor)
  .service('configSrvc', configSrvc)
  .service('searchSrvc', searchSrvc)
  .service('userSrvc', userSrvc)
  .service('Hash', Hash)
  .service('stringMapSrvc', stringMapSrvc)
  .service('errorSrvc', errorSrvc)
  .service('hoverSrvc', hoverSrvc)
  .service('promiseSrvc', promiseSrvc)
  .service('editSrvc', editSrvc)
  .service('webSocket', webSocket)
  .service('eventSrvc', eventSrvc)
  .service('requestSrvc', requestSrvc)
  .service('projectPropertySrvc', projectPropertySrvc)
  .config(whiteList)
  .config(($stateProvider) => {
    $stateProvider
    .state('home', {
      url: '/hlwa',
      views: {
        main: {
          templateUrl: 'src/views/home/home.html',
          controller: homeCtrl,
        },
        footer: {
          templateUrl: 'src/views/footer/footer.html',
        },
      },
    })
    .state('home.id', {
      url: '/:id',
      views: {
        main: {
          templateUrl: 'src/views/home/home.html',
          controller: homeCtrl,
        },
        footer: {
          templateUrl: 'src/views/footer/footer.html',
        },
      },
    })
    .state('results', {
      url: '/results',
      views: {
        main: {
          templateUrl: 'src/views/result/result.html',
          controller: resultCtrl,
        },
        footer: {
          templateUrl: 'src/views/footer/footer.html',
        },
      },
    })
    .state('login', {
      url: '/login',
      views: {
        main: {
          templateUrl: 'src/views/login/login.html',
          controller: loginCtrl,
        },
      },
    })
    .state('reset', {
      url: '/reset/:email/:token',
      views: {
        main: {
          templateUrl: 'src/views/reset/reset.html',
          controller: resetCtrl,
        },
      },
    })
    .state('topic', {
      url: '/topic/:topic',
      views: {
        main: {
          templateUrl: 'src/views/topic/topic.html',
          controller: topicCtrl,
        },
        edit: {
          templateUrl: 'src/views/edit/edit.html',
          controller: editCtrl,
        },
        footer: {
          templateUrl: 'src/views/footer/footer.html',
        },
      },
    })
    .state('revisions', {
      url: '/revisions/:topic',
      views: {
        main: {
          templateUrl: 'src/views/revisions/revisions.html',
          controller: revisionsCtrl,
        },
        footer: {
          templateUrl: 'src/views/footer/footer.html',
        },
      },
    }).state('test', {
      url: '/test',
      views: {
        main: {
          templateUrl: 'src/views/test/test.html',
          controller: testCtrl,
        },
      },
    });

    // $urlRouterProvider.otherwise('/topic');
  });
