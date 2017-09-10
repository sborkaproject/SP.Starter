import gulp from 'gulp'
import gulpif from 'gulp-if'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'

import PATHS from '../paths'
import CONFIG from '../config'

gulp.task('images:build', () => {
	return gulp.src(PATHS.src.images)
		.pipe(gulpif(CONFIG.compress.images, imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		})))
		.pipe(gulp.dest(PATHS.build.images));
});
