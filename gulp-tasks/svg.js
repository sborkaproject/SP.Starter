import gulp from 'gulp';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import path from 'path';

import PATHS from '../paths';

export default function svg() {
	return gulp
		.src(PATHS.src.svg)
		.pipe(
			svgmin(file => {
				const prefix = path.basename(file.relative, path.extname(file.relative));
				return {
					plugins: [
						{
							removeUselessStrokeAndFill: false,
						},
						{
							cleanupIDs: {
								prefix: prefix + '-',
								minify: true,
							},
						},
					],
				};
			})
		)
		.pipe(rename({ prefix: 'icon-' }))
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest(PATHS.build.svg));
}
