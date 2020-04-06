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
		publicPath: '/assets/js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				include: [
					path.resolve(__dirname, 'src/assets/js'),
					path.resolve(__dirname, 'node_modules/gsap'),
				],
				use: ['babel-loader', 'eslint-loader']
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
	},
	plugins: PRODUCTION ? [] : [new webpack.HotModuleReplacementPlugin()],
	devtool: PRODUCTION ? false : '#eval',
	mode: PRODUCTION ? 'production' : 'development',
	optimization: {
		minimize: PRODUCTION,
	},
	watch: !PRODUCTION && !hmrEnabled,
};

export default config;
