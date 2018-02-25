import gulp from 'gulp'
import webpackStream from 'webpack-stream';
import notifier from 'node-notifier'
import gutil from 'gulp-util'
import named from 'vinyl-named'
import { IS_PRODUCTION } from '../config'
import webpack from 'webpack'
import path from 'path'
import WriteFilePlugin from 'write-file-webpack-plugin';


import WEBPACK_CONFIG from '../webpack.config.js';
import PATHS from '../paths'

const defaultStatsOptions = {
	colors: gutil.colors.supportsColor,
	hash: false,
	timings: false,
	chunks: false,
	chunkModules: false,
	modules: false,
	children: true,
	version: true,
	cached: false,
	cachedAssets: false,
	reasons: false,
	source: false,
	errorDetails: false
};

function webpackOld() {
	return gulp.src(PATHS.src.scripts)
		.pipe(named())
		.pipe(webpackStream(WEBPACK_CONFIG, null, (err, stats) => {
			if (stats.compilation.errors.length) {
				notifier.notify({
					title: 'Webpack error',
					message: stats.compilation.errors[0].error.toString()
				});
				let statsOptions = WEBPACK_CONFIG && WEBPACK_CONFIG.stats || {};
				Object.keys(defaultStatsOptions).forEach(function (key) {
					if (typeof statsOptions[key] === 'undefined') {
						statsOptions[key] = defaultStatsOptions[key];
					}
				});
				gutil.log(stats.toString(statsOptions));
			}
		}))
		.pipe(gulp.dest(PATHS.build.scripts));
}

// const hot_client = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&overlay=true';
//
// const entryPoints = {
// 	app: path.resolve(__dirname, '../src/media/js/main.js')
// };
//
// if (!IS_PRODUCTION)
// 	(Object.keys(entryPoints).forEach(entry => entryPoints[entry] = [hot_client].concat(entryPoints[entry])));

export const config = {
	entry: [
		'webpack/hot/dev-server',
		'webpack-hot-middleware/client',
		path.resolve(__dirname, '../src/media/js/main.js')
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../build/media/js'),
		publicPath: '/media/js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: [
					/node_modules/
				],
				// include: path.resolve(__dirname, '../src/media/js/'),
				loader: 'babel-loader?cacheDirectory',
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			}
		],
	},
	// watch: !IS_PRODUCTION,
	// watchOptions: {
	// 	aggregateTimeout: 500
	// },
	resolve: {
		extensions: ['.js'],
		modules: ['node_modules'],
	},
	plugins: IS_PRODUCTION ? [
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			beautify: false,
			compress: true,
			comments: false,
			parallel: {
				cache: true,
				workers: 2
			}
		})
	] : [
		new webpack.HotModuleReplacementPlugin(),
	],
	// devtool: IS_PRODUCTION ? false : '#eval',
	externals: {
		'../TweenLite': 'TweenLite',
		'./TweenLite': 'TweenLite',
		'TweenLite': 'TweenLite',
		'../TweenLite.min.js': 'TweenLite',
		'./TweenLite.min.js': 'TweenLite',
		'TweenLite.min.js': 'TweenLite',
		'../CSSPlugin': 'CSSPlugin',
		'./CSSPlugin': 'CSSPlugin',
		'CSSPlugin': 'CSSPlugin',
	},
	// target: 'web',
	devServer: {
		inline: true,
		port: 9000,
		stats: 'errors-only',
	},
};

export default function scripts() {
	return new Promise(resolve => webpack(config, (err, stats) => {
		if (err) {
			console.log('Webpack', err);
		}

		console.log(stats.toString(defaultStatsOptions));

		resolve();
	}));
}
