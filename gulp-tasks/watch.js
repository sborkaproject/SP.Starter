import gulp from 'gulp'
import watch from 'gulp-watch'

import PATHS from '../paths'

gulp.task('watch', () => {
	watch([PATHS.watch.html], (event, cb) => gulp.start('html:build'));
	watch([PATHS.watch.style], (event, cb) => gulp.start('style:build'));
	watch([PATHS.watch.img], (event, cb) => gulp.start('image:build'));
	watch([PATHS.watch.svg], (event, cb) => gulp.start('svg:build'));
	watch([PATHS.watch.fonts], (event, cb) => gulp.start('fonts:build'));
});
