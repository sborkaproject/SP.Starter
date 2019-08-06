const dom = require('../utils/DOM');
const Utils = require('../utils/Utils');
const Callback = require('../classes/Callback');

const RESIZING_CLASS = '_resizing';

function ResizeHelper() {
	this.onWidthChange = new Callback();
	this.onHeightChange = new Callback();
	this.onChange = new Callback();
	this.currentSizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	this._debouncedFunction = Utils.debounce(() => {
		this._removeResizingState();

		let ww = window.innerWidth;
		let wh = window.innerHeight;

		if (ww !== this.currentSizes.width || wh !== this.currentSizes.height) {
			this.onChange.call();
		}

		if (ww !== this.currentSizes.width) {
			this.currentSizes.width = ww;
			this.onWidthChange.call();
		}

		if (wh !== this.currentSizes.height) {
			this.currentSizes.height = wh;
			this.onHeightChange.call();
		}
	}, 150);

	dom.$window.on('resize', () => {
		this._addResizingState();
		this._debouncedFunction();
	});
}

ResizeHelper.prototype = {
	_addResizingState() {
		dom.$html.addClass(RESIZING_CLASS);
	},
	_removeResizingState() {
		dom.$html.removeClass(RESIZING_CLASS);
	},
};

module.exports = new ResizeHelper();
