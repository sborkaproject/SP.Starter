const dom = require('./DOM');
const $body = dom.$body;

$.fn.outerClick = function(handler) {
	$body.on('mousedown touchstart', e => {
		const target = e.target;

		if (this.is(target)) {
			return;
		}

		if (this.has(target).length) {
			return;
		}

		handler(e);
	});

	return this;
};

$.fn.nope = function(state) {
	return state === false ? this.removeClass('no-pe') : this.addClass('no-pe');
};

$.fn.outline = function(state) {
	return this.css({ outline: state === false ? '' : '1px solid red' });
};

let delayedFocusTimeout;

$.fn.delayedFocus = function(delay) {
	clearTimeout(delayedFocusTimeout);

	delayedFocusTimeout = setTimeout(() => {
		this.focus();
	}, delay || 150);

	return this;
};

$.fn.focusOnEnd = function() {
	this.focus().val(this.val());
	return this;
};

$.fn.delayedFocusOnEnd = function(delay) {
	clearTimeout(delayedFocusTimeout);

	delayedFocusTimeout = setTimeout(() => {
		this.focus().val(this.val());
	}, delay || 150);

	return this;
};
