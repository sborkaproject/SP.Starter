import gutil from 'gulp-util';
import webpack from 'webpack';

import config from '../webpack.config.js';

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
	errorDetails: false,
};

export default function scripts() {
	return new Promise(resolve =>
		webpack(config, (err, stats) => {
			if (err) {
				console.log('Webpack', err);
			}

			console.log(stats.toString(defaultStatsOptions));

			resolve();
		})
	);
}
