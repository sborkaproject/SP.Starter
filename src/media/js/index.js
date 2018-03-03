global.$ = global.jQuery = require('jquery');
global.TweenMax = require('TweenMax');
require('./utils/jqExtensions');

const App = new (function App() { // eslint-disable-line no-unused-vars
	this.env = require('./utils/ENV');
	this.dom = require('./utils/DOM');
	this.utils = require('./utils/Utils');

	this.classes = {
		Callback: require('./classes/Callback'),
	};

	this.helpers = {
		SVGSprites: require('./helpers/SVGSprites'),
	};

	// Startup
	$(() => {
		// Remove _loading modificator
		this.dom.$html.removeClass('_loading');
	});
})();

// App → ProjectName
global.ProjectName = global.App, delete global.App;

if (module.hot) {
	module.hot.accept();
}
