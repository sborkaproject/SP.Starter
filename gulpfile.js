'use strict';
const IS_PRODUCTION = require('./config').IS_PRODUCTION;

const gulp = require('gulp');
const gulpif = require('gulp-if');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cssmin = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
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
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-api');
const prettify = require('gulp-html-prettify');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const gutil = require('gulp-util');

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

if (IS_PRODUCTION) {
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
		templates: './src/templates/',
		html: 'src/templates/*.nunj',
		js: ['src/media/js/main.js'],
		style: 'src/media/sass/screen.sass',
		img: 'src/media/img/**/*.*',
		fonts: 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg: 'src/media/svg/**/*.svg',
		video: 'src/media/video/**/*.*'
	},
	watch: {
		html: 'src/**/*.nunj',
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
	return del(PATHS.clean);
});

gulp.task('html:build', () => {
	gulp.src(PATHS.src.html)
		.pipe(plumber({
			errorHandler: function (err) {
				notifier.notify({
					title: 'Nunjucks compilation error',
					message: err.message
				});
			}
		}))
		.pipe(nunjucksRender({
			src: PATHS.src.templates,
			data: Object.assign({
					DEVELOP: !IS_PRODUCTION
				}, require(`${PATHS.src.templates}global-data.json`)
			),
			filters: require(`${PATHS.src.templates}lib/filters.js`),
			functions: require(`${PATHS.src.templates}lib/functions.js`),
			trimBlocks: true,
			lstripBlocks: true
		}))
		.pipe(prettify({indent_char: ' ', indent_size: 4}))
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
		.pipe(plumber({
			errorHandler: function (err) {
				notifier.notify({
					title: 'SASS compilation error',
					message: err.message
				});
			}
		}))
		.pipe(gulpif(CONFIG.sourcemaps.css, sourcemaps.init()))
		.pipe(sass({
			outputStyle: 'compact',
			sourceMap: false,
			errLogToConsole: true,
			indentedSyntax: true
		})
			.on('error', (err) => {
				gutil.log(err.message);
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

gulp.task('webpack', function () {
	const webpackConfig = require('./webpack.config.js');
	const defaultStatsOptions = {
		colors: gutil.colors.supportsColor,
		hash: false,
		timings: false,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: true,
		version: true,
		cached: false,
		cachedAssets: false,
		reasons: false,
		source: false,
		errorDetails: false
	};
	return gulp.src(PATHS.src.js)
		.pipe(named())
		.pipe(webpackStream(webpackConfig, null, (err, stats) => {
			if (stats.compilation.errors.length) {
				notifier.notify({
					title: 'Webpack error',
					message: stats.compilation.errors[0].error.toString()
				});
			}
			let statsOptions = webpackConfig && webpackConfig.stats || {};
			Object.keys(defaultStatsOptions).forEach(function (key) {
				if (typeof statsOptions[key] === 'undefined') {
					statsOptions[key] = defaultStatsOptions[key];
				}
			});
			gutil.log(stats.toString(statsOptions));
		}))
		.pipe(gulp.dest(PATHS.build.js));
});

gulp.task('zip-archive', () => {
	gulp.src(PATHS.build.html + '/**/*')
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

IS_PRODUCTION ? gulp.task('build', () => runSequence('clean', buildDeps)) : gulp.task('build', buildDeps);

gulp.task('zip', () => runSequence('clean', buildDeps, 'zip-archive'));

gulp.task('default', [
	'build',
	'watch',
	'browserSync'
]);
