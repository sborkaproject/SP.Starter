// import App from './modules/App'
// require('./vendor/jquery.gsap.min');
// require('./utils/jqExtensions');

// var $ = global.$ = global.jQuery = require('./vendor/jquery-3.2.0.min');
// var TweenMax = global.TweenMax = require('./vendor/tweenmax.min');
const App = require('./modules/App');

if (module.hot) {
	// module.hot.accept('./modules/App', () => {
		// require('./modules/App');
	// });

	module.hot.accept();
}
