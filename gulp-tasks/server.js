import historyApiFallback from 'connect-history-api-fallback'
import Rx from 'rx'
import chokidar from 'chokidar'
import gulp from 'gulp'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'

import paths from '../paths'
import { config as webpackConfig } from './webpack'

const browserSync = require('browser-sync').create();
const bundler = webpack(webpackConfig);

console.log('PATH', webpackConfig.output.path);

export default function server() {
	browserSync.init({
		server: {
			baseDir: './build',
			middleware: [
				webpackDevMiddleware(bundler, {
					// IMPORTANT: dev middleware can't access config, so we should
					// provide publicPath by ourselves
					// path: webpackConfig.output.path,
					publicPath: webpackConfig.output.publicPath,
					watchOptions: {
                        poll: true
                    },
					hot: true,

					// pretty colored output
					stats: { colors: true, chunks: false }

					// for other settings see
					// http://webpack.github.io/docs/webpack-dev-middleware.html
				}),
				// webpackDevMiddleware(bundler, {
				// 	quiet: true,
				// 	path: webpackConfig.output.path,
				// 	publicPath: webpackConfig.output.publicPath,
				// 	stats: {
				// 		colors: true,
				// 	},
				// }),
				webpackHotMiddleware(bundler),
				// historyApiFallback(),
			]
		},
		injectchanges: true,
		notify: false,
		open: false,
		port: 9000,
		// logPrefix: 'SP.Starter',
		// files: [
		// 	paths.build.styles + '*.css'
		// ],
	});


	// gulp.watch('build/media/js/*.js').on('change', () => browserSync.reload());

	/**
	 * Create a stream of file-change events
	 */
	// Rx.Observable.create(function (observer) {
	// 	const watcher = chokidar
	// 		.watch([
	// 			// paths.build.scripts + '/*.js',
	// 			paths.build.html + '/*.html',
	// 		], {ignoreInitial: true})
	// 		.on('all', function (event, file) {
	// 			observer.onNext({event, file});
	// 		});
	// 	return function () {
	// 		watcher.close();
	// 	};
	// })
	// /**
	//  * Wait for 300 milliseconds of event silence before emitting
	//  */
	// 	.debounce(300)
	// 	/**
	// 	 * Only look at add/change events
	// 	 */
	// 	.filter(function (x) {
	// 		return x.event === 'add' || x.event === 'change';
	// 	})
	// 	/**
	// 	 * Finally reload the browser
	// 	 */
	// 	.subscribe(function (x) {
	// 		browserSync.reload();
	// 	});
}
