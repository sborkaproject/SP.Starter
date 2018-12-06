module.exports = {
	now: function() {
		const P = 'performance';
		if (window[P] && window[P]['now']) {
			this.now = function() {
				return window.performance.now();
			};
		} else {
			this.now = function() {
				return +new Date();
			};
		}

		return this.now();
	},

	cubicProgress: function(value) {
		value = value < 0 ? 0 : value > 1 ? 1 : value;
		value /= 1 / 2;
		if (value < 1) {
			return (1 / 2) * value * value * value;
		}

		value -= 2;

		return (1 / 2) * (value * value * value + 2);
	},

	debounce: function(func, wait, immediate) {
		let timeout;
		wait = wait || 100;

		return function() {
			const context = this,
				args = arguments;
			const later = function() {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};

			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	},

	throttle: function(func, ms) {
		let isThrottled = false;
		let savedArgs;
		let savedThis;
		ms = ms || 100;
		function wrapper() {
			if (isThrottled) {
				savedArgs = arguments;
				savedThis = this;
				return;
			}

			func.apply(this, arguments);

			isThrottled = true;

			setTimeout(function() {
				isThrottled = false;
				if (savedArgs) {
					wrapper.apply(savedThis, savedArgs);
					savedArgs = savedThis = null;
				}
			}, ms);
		}

		return wrapper;
	},

	formatNumber: function(number) {
		number = number + '';
		let result = '';
		let c = 0;
		for (let k = number.length - 1; k >= 0; k--) {
			if (c === 3) {
				c = 0;
				result = number.substr(k, 1) + ' ' + result;
			} else {
				result = number.substr(k, 1) + result;
			}

			c++;
		}

		return result;
	},

	declOfNum: function(number, titles) {
		const cases = [2, 0, 1, 1, 1, 2];
		return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
	},
};
