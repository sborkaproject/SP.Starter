import gulp from 'gulp'
import del from 'del'

import PATHS from '../paths'

gulp.task('clean', () => {
	return del(PATHS.clean);
});
