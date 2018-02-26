import './utils/jqExtensions'
import dom from './utils/DOM'
import './utils/ENV'

export default new (function App() {
	this.classes = {
	    Callback: require('./classes/Callback'),
	};

	this.helpers = {
	    SVGSprites: require('./helpers/SVGSprites'),
	};

	// Startup
	$(() => {
		// Remove _loading modificator
		dom.$html.removeClass('_loading');
	});
})();
