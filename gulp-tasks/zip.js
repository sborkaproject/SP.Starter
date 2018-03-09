import gulp from 'gulp';
import gulpZip from 'gulp-zip';

import PATHS from '../paths';

export default function zipArchive() {
	return gulp
		.src(PATHS.build.html + '/**/*')
		.pipe(gulpZip(`${PATHS.build.html}.zip`))
		.pipe(gulp.dest('./'));
}
