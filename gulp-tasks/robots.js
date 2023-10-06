import gulp from 'gulp';
import gulpif from 'gulp-if';
import PATHS from '../paths';

// npm run build -- --robots
export default function robots() {
	const args = process.argv.slice(2);
	const isRobots = args.includes('--robots');

	return gulp.src(PATHS.src.robots).pipe(gulpif(isRobots, gulp.dest(PATHS.build.html)));
}
