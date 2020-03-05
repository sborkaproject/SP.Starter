import gulp from 'gulp';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import pngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';

import PATHS from '../paths';
import * as CONFIG from '../config';

export default function images() {
	return gulp
		.src([PATHS.src.images, `!${PATHS.src.imagesInline}/**.*`, `!${PATHS.src.sprites}`])
		.pipe(
			gulpif(
				CONFIG.shouldCompressImages,
				imagemin(
					[
						pngquant(),
						imageminJpegtran({
							progressive: true,
						}),
						imageminMozjpeg({
							quality: 80,
						}),
						imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
					],
					{
						verbose: true,
					}
				)
			)
		)
		.pipe(gulp.dest(PATHS.build.images));
}
