import gulp from 'gulp';
import PATHS from '../paths';

export default function robots() {
	return gulp.src(PATHS.src.robots).pipe(gulp.dest(PATHS.build.html));
}
