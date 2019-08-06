import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import notifier from 'node-notifier';

import PATHS from '../paths';
import webpackConfig from '../webpack.config';
import { hmrEnabled } from '../config';

const fs = require('fs');
const path = require('path');

const browserSync = require('browser-sync').create();
const bundler = webpack(webpackConfig);

let watchFiles = [PATHS.build.styles + '*.css', PATHS.build.html + '/*.html'];

if (!hmrEnabled) {
	watchFiles.push(PATHS.build.scripts + '*.js');
}

const redirectPageURL = '/404.html';
const redirectPagePath = __dirname + '/../build' + redirectPageURL;
const redirectPageContent = fs.existsSync(redirectPagePath)
	? fs.readFileSync(redirectPagePath)
	: false;

export default function server() {
	browserSync.init({
		server: {
			baseDir: './build',
			middleware: hmrEnabled
				? [
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
				  ]
				: [],
		},
		callbacks: {
			ready: function(err, bs) {
				bs.addMiddleware('*', function(req, res) {
					if (redirectPageContent) {
						res.write(redirectPageContent);
					} else {
						res.writeHead(302, {
							location: redirectPageURL,
						});
					}
					res.end();
				});
			},
		},
		ghostMode: false,
		injectchanges: true,
		notify: false,
		open: false,
		port: 9000,
		logPrefix: 'SP.Starter',
		files: watchFiles,
	});
}
