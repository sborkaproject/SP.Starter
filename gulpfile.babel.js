import gulp from 'gulp'
import runSequence from 'run-sequence'
require('require-dir')('gulp-tasks');

import { IS_PRODUCTION } from './config'

const buildDeps = [
	'html:build',
	'style:build',
	'fonts:build',
	'image:build',
	'svg:build',
	'webpack'
];

IS_PRODUCTION ? gulp.task('build', () => runSequence('clean', buildDeps)) : gulp.task('build', buildDeps);

gulp.task('zip', () => runSequence('clean', buildDeps, 'zip-archive'));

gulp.task('default', [
	'build',
	'watch',
	'browserSync'
]);
