'use strict';

const gulp = require('gulp');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('gulp-rimraf');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sprites = require('postcss-sprites');
const assets = require('postcss-assets');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const historyApiFallback = require('connect-history-api-fallback');
const runSequence = require('run-sequence');
const path = require('path');
const zip = require('gulp-zip');

const PRODUCTION = argv.production;

const CONFIG = {
	sourcemaps: {
		css: true,
		js: false
	},
	compress: {
		css: false,
		js: false,
		img: true
	}
};

if (PRODUCTION) {
	CONFIG.sourcemaps = {
		css: false,
		js: false
	};
	CONFIG.compress = {
		css: true,
		js: true,
		img: true
	};
}

const PATHS = {
	build: {
		html: 'build',
		js: 'build/media/js/',
		css: 'build/media/css/',
		img: 'build/media/img/',
		fonts: 'build/media/fonts/',
		sprites: 'build/media/img/sprites/',
		svg: 'build/media/svg/',
		video: 'build/media/video/'
	},
	src: {
		html: 'src/*.html',
		js: ['src/media/js/main.js'],
		style: 'src/media/sass/screen.sass',
		img: 'src/media/img/**/*.*',
		fonts: 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg: 'src/media/svg/**/*.svg',
		video: 'src/media/video/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/media/js/**/*.js',
		style: 'src/media/sass/**/*.sass',
		img: 'src/media/img/**/*.*',
		fonts: 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg: 'src/media/svg/**/*.svg'
	},
	clean: 'build/'
};

gulp.task('clean', () => {
	gulp.src(PATHS.clean, {read: false})
		.pipe(rimraf({force: true}));
});

gulp.task('html:build', () => {
	gulp.src(PATHS.src.html)
		.pipe(rigger({tolerant: true}))
		.pipe(gulp.dest(PATHS.build.html));
});

gulp.task('style:build', () => {
	const PROCESSORS = [
		autoprefixer({
			browsers: ['last 4 versions'],
			cascade: true
		}),
		assets({
			basePath: 'src/',
			baseUrl: '../',
			loadPaths: ['media/img/']
		}),
		sprites({
			stylesheetPath: './build/media/css/',
			spritePath: './build/media/img/sprite.png',
			retina: true,
			outputDimensions: true,
			padding: 4,
			filterBy: (image) => /sprites\/.*\.png$/gi.test(image.url)
		})
	];

	gulp.src(PATHS.src.style)
		.pipe(gulpif(CONFIG.sourcemaps.css, sourcemaps.init()))
		.pipe(sass({
			outputStyle: 'compact',
			sourceMap: false,
			errLogToConsole: true,
			indentedSyntax: true
		}).on('error', (err) => {
			console.error('Error: ', err.message);
		}))
		.pipe(postcss(PROCESSORS))
		.pipe(gulpif(CONFIG.compress.css, cssmin({processImport: false})))
		.pipe(gulpif(CONFIG.sourcemaps.css, sourcemaps.write()))
		.pipe(gulp.dest(PATHS.build.css));

});

gulp.task('image:build', () => {
	gulp.src(PATHS.src.img)
		.pipe(gulpif(CONFIG.compress.img, imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		})))
		.pipe(gulp.dest(PATHS.build.img));
});

gulp.task('fonts:build', () => {
	gulp.src(PATHS.src.fonts)
		.pipe(gulp.dest(PATHS.build.fonts));
});

gulp.task('svg:build', () => {
	gulp.src(PATHS.src.svg)
		.pipe(svgmin(file => {
			const prefix = path.basename(file.relative, path.extname(file.relative));
			return {
				plugins: [{
					removeUselessStrokeAndFill: false
				}, {
					cleanupIDs: {
						prefix: prefix + '-',
						minify: true
					}
				}]
			};
		}))
		.pipe(rename({prefix: 'icon-'}))
		.pipe(svgstore({inlineSvg: true}))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest(PATHS.build.svg));
});

gulp.task('webpack', () => {
	let webpackConfig = require('./webpack.config.js');
	return gulp.src(PATHS.src.js)
		.pipe(named())
		.pipe(webpackStream(webpackConfig, null))
		.pipe(gulp.dest(PATHS.build.js));
});

gulp.task('zip', () => {
	gulp.src(PATHS.build.html)
		.pipe(zip(`${PATHS.build.html}.zip`))
		.pipe(gulp.dest('./'));
});

gulp.task('browserSync', () => {
	let browserSync = require('browser-sync');
	browserSync({
		server: {
			baseDir: 'build',
		},
		host: 'localhost',
		port: 9000,
		logPrefix: 'SP.Starter',
		open: false,
		files: [
			'build/media/css/*.css',
			'build/media/js/*.js',
			'build/*.html',
		],
		middleware: [historyApiFallback({
			htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
			rewrites: [
				{from: /.*!test.json/, to: '/index.html'}
			]
		})]
	});
});

gulp.task('watch', () => {
	watch([PATHS.watch.html], (event, cb) => gulp.start('html:build'));
	watch([PATHS.watch.style], (event, cb) => gulp.start('style:build'));
	watch([PATHS.watch.img], (event, cb) => gulp.start('image:build'));
	watch([PATHS.watch.svg], (event, cb) => gulp.start('svg:build'));
	watch([PATHS.watch.fonts], (event, cb) => gulp.start('fonts:build'));
});

const buildDeps = [
	'html:build',
	'style:build',
	'fonts:build',
	'image:build',
	'svg:build',
	'webpack'
];

PRODUCTION ? gulp.task('build', () => runSequence('clean', buildDeps)) : gulp.task('build', buildDeps);

gulp.task('default', [
	'build',
	'watch',
	'browserSync'
]);
