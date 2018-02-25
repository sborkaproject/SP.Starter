class Test {
	constructor() {
		this.init();
		document.body.addEventListener('click', this.someMethod);

		if (module.hot) {
			module.hot.dispose(() => {
				document.body.removeEventListener('click', this.someMethod);
			});
		}
	}

	init() {
		console.log('blah blah');
	}

	someMethod() {
		console.log('f !!saDas 123 sads test22 sdfasfd');
	}
}

export default new Test
