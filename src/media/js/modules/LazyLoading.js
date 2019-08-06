const dom = require('../utils/DOM');
const ResizeHelper = require('../helpers/ResizeHelper');

const DELAY_DEFAULT = 70;
const CACHE = [];

function LazyLoading() {
	this.queue = [];
	dom.$window.on('load', () => this.update());
}

LazyLoading.prototype = {
	update() {
		let $elements = dom.$body.find('[data-src], [data-srcset]');
		if (!$elements.length) {
			return;
		}

		this.enqueue($elements);
		requestAnimationFrame(() => this.initQueue());
	},
	enqueue($elements) {
		if (!$elements || !$elements.length) {
			return;
		}

		$elements.get().forEach(el => requestAnimationFrame(() => this._enqueueSingle(el)));
	},
	_enqueueSingle($element) {
		if (!($element instanceof jQuery)) {
			if (typeof $element === 'object') {
				$element = $($element);
			} else {
				return;
			}
		}

		let dAttrSrcSet = $element.attr('data-srcset');
		let dAttrSrc = $element.attr('data-src');

		const func = () => {
			let isElementVisisble = $element.css('display') !== 'none';

			const replaceDataAttributes = () => {
				$element.one('load', () => $element.trigger('lazy-loaded'));

				if (dAttrSrcSet) {
					$element.attr('srcset', dAttrSrcSet).removeAttr('data-srcset');
				}
				if (dAttrSrc) {
					$element.attr('src', dAttrSrc).removeAttr('data-src');
				}

				$element.trigger('lazy-started');
			};

			if (isElementVisisble) {
				replaceDataAttributes();
			} else {
				const f = () => {
					let isElementVisisble = $element.css('display') !== 'none';
					if (!isElementVisisble) {
						return;
					}

					ResizeHelper.onWidthChange.remove(f);
					replaceDataAttributes();
				};
				ResizeHelper.onWidthChange.add(f);
			}

			dAttrSrc && CACHE.push(dAttrSrc);
			dAttrSrcSet && CACHE.push(dAttrSrcSet);
		};

		if (CACHE.indexOf(dAttrSrc) >= 0 || CACHE.indexOf(dAttrSrcSet) >= 0) {
			func();
		} else if (this.queueFiredOnce) {
			setTimeout(func, DELAY_DEFAULT);
		} else {
			this.queue.push(func);
		}
	},
	initQueue() {
		this.queueFiredOnce = true;
		if (!this.queue.length) {
			return;
		}

		let i = 0;

		while (this.queue.length > 0) {
			let func = this.queue.shift();
			if (typeof func !== 'function') {
				continue;
			}

			setTimeout(func, DELAY_DEFAULT * i);
			i++;
		}
	},
};

module.exports = new LazyLoading();
