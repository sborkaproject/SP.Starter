class Signal {
	constructor() {
		this.handlers = [];
	}

	_throwError() {
		throw new TypeError('Signal handler must be function!');
	}

	add(handler, context) {
		if (typeof handler !== 'function') {
			this._throwError();
			return null;
		}
		this.handlers.push({ handler: handler, context: context });
		return handler;
	}

	remove(handler) {
		if (typeof handler !== 'function') {
			this._throwError();
			return null;
		}
		const totalHandlers = this.handlers.length;
		for (let k = 0; k < totalHandlers; k++) {
			if (handler === this.handlers[k].handler) {
				this.handlers.splice(k, 1);
				return handler;
			}
		}
		return null;
	}

	call() {
		const totalHandlers = this.handlers.length;
		for (let k = 0; k < totalHandlers; k++) {
			const handlerData = this.handlers[k];
			handlerData.handler.apply(handlerData.context || null, arguments);
		}
	}

	delayedCall(delay = 16) {
		delay = delay || 100;

		const args = Array.prototype.slice.call(arguments);
		args.shift();

		setTimeout(() => {
			this.call.apply(this, args);
		}, delay);
	}
}

export default Signal;
