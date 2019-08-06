import { TweenMax } from 'gsap';
global.TweenMax = TweenMax;
global.$ = global.jQuery = require('jquery');
require('./utils/jqExtensions');

global.ProjectName && window.location.reload();

global.ProjectName = new (function ProjectName() {
	this.env = require('./utils/ENV');
	this.dom = require('./utils/DOM');
	this.utils = require('./utils/Utils');

	this.classes = {
		Callback: require('./classes/Callback'),
	};

	this.helpers = {
		BodyLocker: require('./helpers/BodyLocker'),
		ResizeHelper: require('./helpers/ResizeHelper'),
	};

	this.modules = {
		LazyLoading: require('./modules/LazyLoading'),
	};

	// Startup
	$(() => {
		// Remove _loading modificator
		this.dom.$html.removeClass('_loading _resizing');
	});
})();

if (module.hot) {
	module.hot.accept();
}
