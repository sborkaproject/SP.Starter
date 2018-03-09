import gulp from 'gulp';

import PATHS from '../paths';

export default function fonts() {
	return gulp.src(PATHS.src.fonts).pipe(gulp.dest(PATHS.build.fonts));
}
