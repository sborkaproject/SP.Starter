let dom = require('../utils/DOM');
let env = require('../utils/ENV');
let Utils = require('../utils/Utils');
let Callback = require('../classes/Callback');

const MANUALLY_KEEP_SCROLL_TOP = env.isIOS;

function BodyLocker() {
	this.onLock = new Callback();
	this.onUnlock = new Callback();

	if (env.isMobile) {
		this.scrollWidth = 0;
	} else {
		this.$widthTestElements = dom.$html.add(dom.$body);

		this.$widthTestElements.css({
			overflow: 'visible',
		});
		let realWidth = dom.$html.width();

		this.$widthTestElements.css({
			overflow: 'hidden',
		});
		let hiddenWidth = dom.$html.width();

		this.$widthTestElements.css({
			overflow: '',
		});

		this.scrollWidth = hiddenWidth - realWidth;
	}

	if (MANUALLY_KEEP_SCROLL_TOP) {
		this.scrollParent = env.isIOS ? document.body : document.documentElement;
	}
}

BodyLocker.prototype = {
	_updateFixedElements() {
		this.$fixedPageElems = dom.$wrapper.add($('[data-fixed-element]'));
	},
	lock: function() {
		if (this.locked) {
			return;
		}

		this.locked = true;
		dom.$html.css('overflow', 'hidden');
		this._updateFixedElements();

		if (this.scrollWidth > 0) {
			this.$fixedPageElems.css({
				paddingRight: this.scrollWidth,
			});
		}

		this.onLock.call();
		if (MANUALLY_KEEP_SCROLL_TOP) {
			this.savedScrollPosition = Utils.getCurrentScrollTop();
			dom.$body.css({
				height: '100%',
				overflow: 'hidden',
			});
			this.scrollParent.scrollTop = this.savedScrollPosition;
		}
	},
	unlock: function() {
		if (!this.locked) {
			return;
		}

		this.locked = false;
		dom.$html.css('overflow', '');
		this._updateFixedElements();

		if (this.scrollWidth > 0) {
			this.$fixedPageElems.css({
				paddingRight: '',
			});
		}

		if (MANUALLY_KEEP_SCROLL_TOP) {
			dom.$body.css({
				height: '',
				overflow: '',
			});
			this.scrollParent.scrollTop = this.savedScrollPosition;
			this.savedScrollPosition = null;
			delete this.savedScrollPosition;
		}
		this.onUnlock.call();
	},
};

module.exports = new BodyLocker();
