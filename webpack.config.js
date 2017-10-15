'use strict';
import { IS_PRODUCTION } from './config'
import webpack from 'webpack'
import path from 'path'

const PATHS = {
	app: path.resolve(__dirname, 'src/media/js/')
};

const config = {
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: [
					/node_modules/
				],
				include: PATHS.app,
				loader: 'babel-loader',
				query: {
					compact: true,
					cacheDirectory: true
				}
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			}
		],
	},
	watch: !IS_PRODUCTION,
	watchOptions: {
		aggregateTimeout: 500
	},
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
	] : [],
	devtool: IS_PRODUCTION ? false : '#eval',
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
	}
};

export default config
