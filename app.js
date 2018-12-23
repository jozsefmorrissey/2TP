import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { hoverResource } from './src/directives/hoverResource';
import { navBar } from './src/directives/navBar';
import { internalLink } from './src/directives/internalLink';
import { externalLink } from './src/directives/externalLink';
import { resizable } from './src/directives/resizable';
import { editor } from './src/directives/editor';

import { configSrvc } from './src/services/configSrvc';
import { stateSrvc } from './src/services/stateSrvc';
import { hoverSrvc } from './src/services/hoverSrvc';
import { editSrvc } from './src/services/editSrvc';
import { errorSrvc } from './src/services/errorSrvc';
import { Hash } from './src/services/Hash';

import { helpCtrl } from './src/views/help/help';
import { editCtrl } from './src/views/edit/edit';

const jozsefLib = require('jozsef-lib');
require('angular-trix');

function whiteList($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    'http://localhost:3100/',
  ]);
}

angular.module('routerApp', [uiRouter, jozsefLib, 'angularTrix'])
  .directive('hoverResource', hoverResource)
  .directive('navBar', navBar)
  .directive('internalLink', internalLink)
  .directive('externalLink', externalLink)
  .directive('resizable', resizable)
  .directive('editor', editor)
  .service('configSrvc', configSrvc)
  .service('stateSrvc', stateSrvc)
  .service('Hash', Hash)
  .service('errorSrvc', errorSrvc)
  .service('hoverSrvc', hoverSrvc)
  .service('editSrvc', editSrvc)
  .config(whiteList)
  .config(($stateProvider) => {
    $stateProvider
    .state('help', {
      url: '/help',
      views: {
        main: {
          templateUrl: 'src/views/help/help.html',
          controller: helpCtrl,
        },
        edit: {
          templateUrl: 'src/views/edit/edit.html',
          controller: editCtrl,
        },
      },
    })
    .state('help.topic', {
      url: '/:topic',
      views: {
        main: {
          templateUrl: 'src/views/help/topic/topic.html',
          controller: helpCtrl,
        },
        edit: {
          templateUrl: 'src/views/edit/edit.html',
          controller: editCtrl,
        },
      },
    });

    // $urlRouterProvider.otherwise('/help');
  });
