import gulp from 'gulp'
import webpackStream from 'webpack-stream';
import notifier from 'node-notifier'
import gutil from 'gulp-util'
import named from 'vinyl-named'

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

gulp.task('webpack', function () {
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
});
