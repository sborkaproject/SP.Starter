global.$ = global.jQuery = require('jquery');
global.TweenMax = require('TweenMax');
require('./App');

if (module.hot) {
	module.hot.accept();
}
