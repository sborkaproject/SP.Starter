'use strict';
import { IS_PRODUCTION } from './config'
import webpack from 'webpack'

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

if (IS_PRODUCTION) {
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
    watch: !IS_PRODUCTION,
	watchOptions: {
		aggregateTimeout: 700
	},
    resolve:  {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules', 'bower_components']
    },
    plugins: plugins,
    debug: !IS_PRODUCTION,
    devtool: IS_PRODUCTION ? null : '#eval',
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

export default config;
