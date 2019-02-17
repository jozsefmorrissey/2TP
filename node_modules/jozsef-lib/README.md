### To install
npm install jozsef-lib

### lazyloader
To utilze lazyLoad service during config

let jozsefLib = require('jozsef-lib');

angular.module('jozsefLib')<br>
&nbsp;&nbsp;&nbsp;.config(function(LazyLoad){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let str = `app.directive('garb', function () {console.log('garb service')})`;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LazyLoad.loadFromString('app', str);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LazyLoad.loadFromUrl('app', '/resources/json/pm.js');<br>
&nbsp;&nbsp;&nbsp;});<br>
