'use strict';
import webpack from 'webpack';
import path from 'path';

import { PRODUCTION, hmrEnabled } from './config';
import paths from './paths';

const entryPoints = {
	bundle: path.resolve(__dirname, paths.src.scripts),
};

const hotMiddlewareString = 'webpack-hot-middleware/client?quiet=true&noInfo=true';

export const config = {
	entry: Object.keys(entryPoints).reduce((acc, currentKey) => {
		acc[currentKey] = [entryPoints[currentKey]];
		!PRODUCTION && hmrEnabled && acc[currentKey].push(hotMiddlewareString);
		return acc;
	}, {}),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, paths.build.scripts),
		publicPath: '/media/js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				use: [
					{
						options: {
							eslintPath: require.resolve('eslint'),
							cache: true,
							configFile: path.resolve('.eslintrc'),
						},
						loader: require.resolve('eslint-loader'),
					},
				],
				exclude: [/node_modules/],
			},
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
		],
	},
	resolve: {
		extensions: ['.js'],
		modules: ['node_modules'],
		alias: {
			TweenLite: path.resolve('node_modules/gsap/src/uncompressed/TweenLite.js'),
			TweenMax: path.resolve('node_modules/gsap/src/uncompressed/TweenMax.js'),
			TimelineMax: path.resolve('node_modules/gsap/src/uncompressed/TimelineMax.js'),
			TimelineLite: path.resolve('node_modules/gsap/src/uncompressed/TimelineLite.js'),
			ScrollToPlugin: path.resolve('node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js'),
			Draggable: path.resolve('node_modules/gsap/src/uncompressed/utils/Draggable.js'),
			TextPlugin: path.resolve('node_modules/gsap/src/uncompressed/utils/TextPlugin.js'),
		},
	},
	plugins: PRODUCTION ? [] : [new webpack.HotModuleReplacementPlugin()],
	devtool: PRODUCTION ? false : '#eval',
	mode: PRODUCTION ? 'production' : 'development',
	optimization: {
		minimize: PRODUCTION,
	},
	watch: !PRODUCTION && !hmrEnabled,
	externals: {
		'../TweenLite': 'TweenLite',
		'./TweenLite': 'TweenLite',
		TweenLite: 'TweenLite',
		'../TimelineLite': 'TimelineLite',
		'./TimelineLite': 'TimelineLite',
		TimelineLite: 'TimelineLite',
		'../TweenLite.min.js': 'TweenLite',
		'./TweenLite.min.js': 'TweenLite',
		'TweenLite.min.js': 'TweenLite',
		'../CSSPlugin': 'CSSPlugin',
		'./CSSPlugin': 'CSSPlugin',
		CSSPlugin: 'CSSPlugin',
	},
};

export default config;
