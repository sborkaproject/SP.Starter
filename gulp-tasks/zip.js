import gulp from 'gulp'
import zip from 'gulp-zip'

import PATHS from '../paths'

gulp.task('zip-archive', () => {
	gulp.src(PATHS.build.html + '/**/*')
		.pipe(zip(`${PATHS.build.html}.zip`))
		.pipe(gulp.dest('./'));
});

