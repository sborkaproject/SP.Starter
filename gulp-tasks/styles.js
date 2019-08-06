import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notifier from 'node-notifier';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sprites from 'postcss-sprites';
import assets from 'postcss-assets';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cssmin from 'gulp-clean-css';
import gulpif from 'gulp-if';
import log from 'fancy-log';
import colors from 'ansi-colors';

import PATHS from '../paths';
import { PRODUCTION } from '../config';

const PROCESSORS = [
	autoprefixer({
		cascade: true,
	}),
	assets({
		loadPaths: [PATHS.src.imagesInline],
		cache: true,
	}),
	sprites({
		stylesheetPath: './build/media/css/',
		spritePath: './build/media/img/',
		retina: true,
		padding: 4,
		filterBy: image =>
			/sprites\/.*\.png$/gi.test(image.url) ? Promise.resolve() : Promise.reject(),
	}),
];

export default function styles() {
	return gulp
		.src(PATHS.src.styles)
		.pipe(
			plumber({
				errorHandler: function(err) {
					log.error(colors.red(err.message));
					notifier.notify({
						title: 'SASS compilation error',
						message: err.message,
					});
				},
			})
		)
		.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
		.pipe(
			sass({
				outputStyle: 'compact',
				errLogToConsole: true,
				indentedSyntax: true,
			})
		)
		.pipe(postcss(PROCESSORS))
		.pipe(gulpif(PRODUCTION, cssmin({ processImport: false })))
		.pipe(gulpif(!PRODUCTION, sourcemaps.write()))
		.pipe(gulp.dest(PATHS.build.styles));
}
