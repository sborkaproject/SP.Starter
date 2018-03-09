import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import notifier from 'node-notifier';

import paths from '../paths';
import webpackConfig from '../webpack.config';

const browserSync = require('browser-sync').create();
const bundler = webpack(webpackConfig);

export default function server() {
	browserSync.init({
		server: {
			baseDir: './build',
			middleware: [
				webpackDevMiddleware(bundler, {
					publicPath: webpackConfig.output.publicPath,
					logLevel: 'error',
					reporter: (middlewareOptions, options) => {
						const { state, stats } = options;
						if (state) {
							if (stats.hasErrors()) {
								notifier.notify({
									title: 'Webpack compilation error',
									message: stats.compilation.errors[0].error.toString(),
								});
							}
						}
					},
				}),
				webpackHotMiddleware(bundler, {
					log: false,
				}),
			],
		},
		injectchanges: true,
		notify: false,
		open: false,
		port: 9000,
		logPrefix: 'SP.Starter',
		files: [paths.build.styles + '*.css', paths.build.html + '/*.html'],
	});
}
