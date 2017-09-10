import gulp from 'gulp'
import plumber from 'gulp-plumber'
import notifier from 'node-notifier'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import sprites from 'postcss-sprites'
import assets from 'postcss-assets'
import gutil from 'gulp-util'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import cssmin from 'gulp-clean-css';
import gulpif from 'gulp-if'

import PATHS from '../paths'
import CONFIG from '../config'

const PROCESSORS = [
	autoprefixer({
		browsers: ['last 4 versions'],
		cascade: true
	}),
	assets({
		basePath: 'src/',
		baseUrl: '../',
		loadPaths: ['media/img/']
	}),
	sprites({
		stylesheetPath: './build/media/css/',
		spritePath: './build/media/img/sprite.png',
		retina: true,
		outputDimensions: true,
		padding: 4,
		filterBy: (image) => /sprites\/.*\.png$/gi.test(image.url)
	})
];

gulp.task('styles:build', () => {
	gulp.src(PATHS.src.styles)
		.pipe(plumber({
			errorHandler: function (err) {
				gutil.log(err.message);
				notifier.notify({
					title: 'SASS compilation error',
					message: err.message
				});
			}
		}))
		.pipe(gulpif(CONFIG.sourcemaps.styles, sourcemaps.init()))
		.pipe(sass({
			outputStyle: 'compact',
			sourceMap: false,
			errLogToConsole: true,
			indentedSyntax: true
		}))
		.pipe(postcss(PROCESSORS))
		.pipe(gulpif(CONFIG.compress.css, cssmin({processImport: false})))
		.pipe(gulpif(CONFIG.sourcemaps.css, sourcemaps.write()))
		.pipe(gulp.dest(PATHS.build.styles));
});
