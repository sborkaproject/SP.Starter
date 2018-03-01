'use strict';
import webpack from 'webpack'
import path from 'path'

import { PRODUCTION } from './config'
import paths from './paths';

let entry = [
	path.resolve(__dirname, paths.src.scripts)
];

!PRODUCTION && entry.push(
	'webpack-hot-middleware/client?quiet=true&noInfo=true'
);

export const config = {
	entry,
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, paths.build.scripts),
		publicPath: '/media/js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [
					/node_modules/
				],
				loader: 'babel-loader?cacheDirectory',
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			}
		],
	},
	resolve: {
		extensions: ['.js'],
		modules: ['node_modules'],
		alias: {
			TweenLite: path.resolve(__dirname, './node_modules/gsap/src/uncompressed/TweenLite.js'),
			TweenMax: path.resolve(__dirname, './node_modules/gsap/src/uncompressed/TweenMax.js'),
			ScrollToPlugin: path.resolve(__dirname, './node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js'),
			Draggable: path.resolve(__dirname, './node_modules/gsap/src/uncompressed/utils/Draggable.js'),
			TextPlugin: path.resolve(__dirname, './node_modules/gsap/src/uncompressed/utils/TextPlugin.js'),
		},
	},
	plugins: PRODUCTION ? [] : [
		new webpack.HotModuleReplacementPlugin(),
	],
	devtool: PRODUCTION ? false : '#eval',
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
	mode: PRODUCTION ? 'production' : 'development',
	optimization: {
		minimize: PRODUCTION
	},
};

export default config
