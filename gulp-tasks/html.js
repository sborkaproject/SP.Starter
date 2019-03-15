import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-api';
import notifier from 'node-notifier';
import plumber from 'gulp-plumber';
import beautify from 'gulp-jsbeautifier';
import minifyInline from 'gulp-minify-inline-scripts';
import gulpif from 'gulp-if';
import log from 'fancy-log';
import colors from 'ansi-colors';

import { PRODUCTION } from '../config';
import PATHS from '../paths';
import * as extensions from '../src/templates/lib/extensions.js';
import filters from '../src/templates/lib/filters.js';
import functions from '../src/templates/lib/functions.js';

export default function html() {
	delete require.cache[require.resolve('../global-data.json')];
	const globalData = require('../global-data.json');

	return gulp
		.src(PATHS.src.nunj)
		.pipe(
			plumber({
				errorHandler: function(err) {
					log.error(colors.red(err.message));
					notifier.notify({
						title: 'Nunjucks compilation error',
						message: err.message,
					});
				},
			})
		)
		.pipe(
			nunjucksRender({
				src: PATHS.src.templates,
				data: Object.assign(
					{
						DEVELOP: !PRODUCTION,
					},
					globalData
				),
				extensions,
				filters,
				functions,
				trimBlocks: true,
				lstripBlocks: true,
				autoescape: false,
			})
		)
		.pipe(
			gulpif(
				PRODUCTION,
				beautify({
					max_preserve_newlines: 1,
					wrap_line_length: 0,
				})
			)
		)
		.pipe(gulpif(PRODUCTION, minifyInline()))
		.pipe(gulp.dest(PATHS.build.html));
}
