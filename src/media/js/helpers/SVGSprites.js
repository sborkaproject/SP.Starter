const Callback = require('../classes/Callback');
const InvisibleContainer = require('./InvisibleContainer');

function SVGSprites() {
	this.onLoad = new Callback();
	this.loaded = false;

	$.get('/media/svg/sprite.svg', data => {
		if (!data || !data.documentElement || typeof data.documentElement !== 'object') {
			this.loaded = true;
			this.onLoad.call();
			return;
		}
		InvisibleContainer.add(
			typeof XMLSerializer !== 'undefined'
				? new XMLSerializer().serializeToString(data.documentElement)
				: $(data.documentElement).html()
		);
		this.loaded = true;
		this.onLoad.call();
	});
}

module.exports = new SVGSprites();
