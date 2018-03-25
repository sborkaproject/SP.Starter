'use strict';
import webpack from 'webpack';
import path from 'path';

import { PRODUCTION } from './config';
import paths from './paths';

let entry = [path.resolve(__dirname, paths.src.scripts)];

!PRODUCTION && entry.push('webpack-hot-middleware/client?quiet=true&noInfo=true');

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
				enforce: 'pre',
				use: [
					{
						options: {
							eslintPath: require.resolve('eslint'),
							cache: true,
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
	},
	plugins: PRODUCTION ? [] : [new webpack.HotModuleReplacementPlugin()],
	devtool: PRODUCTION ? false : '#eval',
	mode: PRODUCTION ? 'production' : 'development',
	optimization: {
		minimize: PRODUCTION,
	},
};

export default config;
