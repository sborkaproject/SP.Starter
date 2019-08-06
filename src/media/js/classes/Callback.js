// Callback is equal to Signal

function Callback() {
	this._handlers = [];

	const self = this;
	this.callShim = function() {
		self.call.apply(self, arguments);
	};
}

Callback.prototype = {
	_throwError: function() {
		throw new TypeError('Callback handler must be function!');
	},

	add: function(handler, context, once = false) {
		if (typeof handler !== 'function') {
			this._throwError();
			return;
		}

		this._handlers.push({ handler: handler, context: context, once: once });

		return handler;
	},

	remove: function(handler) {
		if (typeof handler !== 'function') {
			this._throwError();
			return;
		}

		const totalHandlers = this._handlers.length;
		for (let k = 0; k < totalHandlers; k++) {
			if (handler === this._handlers[k].handler) {
				this._handlers.splice(k, 1);
				return handler;
			}
		}
	},

	call: function() {
		for (let k = 0; k < this._handlers.length; k++) {
			const handlerData = this._handlers[k];
			handlerData.handler.apply(handlerData.context || null, arguments);
			if (handlerData.once) {
				this.remove(handlerData.handler);
				k--;
			}
		}
	},

	delayedCall: function(delay) {
		const self = this;
		delay = delay || 100;

		const args = Array.prototype.slice.call(arguments);
		args.shift();

		setTimeout(function() {
			self.call.apply(self, args);
		}, delay);
	},
};

module.exports = Callback;
