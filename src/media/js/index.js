import { TweenMax } from 'gsap';
global.TweenMax = TweenMax;
global.$ = global.jQuery = require('jquery');
require('./utils/jqExtensions');

// prettier-ignore
const App = new function App() { // eslint-disable-line
	this.env = require('./utils/ENV');
	this.dom = require('./utils/DOM');
	this.utils = require('./utils/Utils');

	this.classes = {
		Callback: require('./classes/Callback')
	};

	this.helpers = {
		SVGSprites: require('./helpers/SVGSprites')
	};

	// Startup
	$(() => {
		// Remove _loading modificator
		this.dom.$html.removeClass('_loading');
	});
}();

// App → ProjectName
(global.ProjectName = global.App), delete global.App; //eslint-disable-line

if (module.hot) {
	module.hot.accept();
}
