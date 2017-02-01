'use strict';

const webpack = require('webpack');
const argv = require('yargs').argv;

const PATHS = {
    app: __dirname + '/src/media/js'
};

let plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    )
];

if (argv.production) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        beautify: false,
        compress: true,
        comments: false
    }));
}

const config = {
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [
                    /node_modules/,
                    /bower_components/
                ],
                include: PATHS.app,
                loader: 'babel-loader',
                query: {
                    presets: [
                    	'es2015'
                    ]
                }
            },
            {
                test: /\.json?$/,
                loader: 'json-loader',
            }
        ],
    },
    watch: !argv.production,
	watchOptions: {
		aggregateTimeout: 700
	},
    resolve:  {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules', 'bower_components']
    },
    plugins: plugins,
    debug: !argv.production,
    devtool: argv.production ? null : '#eval',
    externals: {
        '../TweenLite': 'TweenLite',
        './TweenLite': 'TweenLite',
        'TweenLite': 'TweenLite',
        '../CSSPlugin': 'CSSPlugin',
        './CSSPlugin': 'CSSPlugin',
        'CSSPlugin': 'CSSPlugin',
        'jquery': 'jQuery'
    }
};

module.exports = config;
