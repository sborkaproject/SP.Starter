import webpack from 'webpack';
import log from 'fancy-log';

import config from '../webpack.config.js';

const defaultStatsOptions = {
	colors: true,
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
				log.error(err.message);
			}

			console.log(stats.toString(defaultStatsOptions));

			resolve();
		})
	);
}
