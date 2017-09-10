import gulp from 'gulp'
import gutil from 'gulp-util'
import nunjucksRender from 'gulp-nunjucks-api'
import prettify from 'gulp-html-prettify'
import notifier from 'node-notifier'
import plumber from 'gulp-plumber'

import { IS_PRODUCTION } from '../config'
import PATHS from '../paths'
import filters from '../src/templates/lib/filters.js'
import functions from '../src/templates/lib/functions.js'
const globalData = require('../global-data.json');

gulp.task('html:build', () => {
	return gulp.src(PATHS.src.nunj)
		.pipe(plumber({
			errorHandler: function (err) {
				gutil.log(err.message);
				notifier.notify({
					title: 'Nunjucks compilation error',
					message: err.message
				});
			}
		}))
		.pipe(nunjucksRender({
			src: PATHS.src.templates,
			data: Object.assign(
				{
					DEVELOP: !IS_PRODUCTION
				},
				globalData
			),
			filters: filters,
			functions: functions,
			trimBlocks: true,
			lstripBlocks: true,
			autoescape: false
		}))
		.pipe(prettify({indent_char: ' ', indent_size: 4}))
		.pipe(gulp.dest(PATHS.build.html));
});
