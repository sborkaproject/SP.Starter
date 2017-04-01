import gulp from 'gulp'

import PATHS from '../paths'

gulp.task('fonts:build', () => {
	return gulp.src(PATHS.src.fonts)
		.pipe(gulp.dest(PATHS.build.fonts));
});
