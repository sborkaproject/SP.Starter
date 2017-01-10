'use strict';

var gulp				= require('gulp'),
	argv				= require('yargs').argv,
	gulpif				= require('gulp-if'),
	watch				= require('gulp-watch'),
	sass				= require('gulp-sass'),
	sourcemaps			= require('gulp-sourcemaps'),
	cssmin				= require('gulp-clean-css'),
	imagemin			= require('gulp-imagemin'),
	pngquant			= require('imagemin-pngquant'),
	rimraf				= require('gulp-rimraf'),
	postcss				= require('gulp-postcss'),
	autoprefixer		= require('autoprefixer'),
	sprites				= require('postcss-sprites'), //.default,
	assets				= require('postcss-assets'),
	svgstore			= require('gulp-svgstore'),
	svgmin				= require('gulp-svgmin'),
	rename				= require('gulp-rename'),
	webpackStream 		= require('webpack-stream'),
	named 				= require('vinyl-named'),
	historyApiFallback	= require('connect-history-api-fallback'),
	runSequence			= require('run-sequence'),
	path                = require('path'),
	nunjucksRender      = require('gulp-nunjucks-api'),
	prettify            = require('gulp-html-prettify'),
	plumber             = require('gulp-plumber'),
	notify              = require('gulp-notify');


var PRODUCTION = argv.production;

var CONFIG = {
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

var PATHS = {
	build: {
		html:	 'build/',
		js:		 'build/media/js/',
		css:	 'build/media/css/',
		img:	 'build/media/img/',
		fonts:	 'build/media/fonts/',
		sprites: 'build/media/img/sprites/',
		svg:	 'build/media/svg/',
		video:	 'build/media/video/'
	},
	src: {
		html:	 'src/templates/*.nunj',
		js:		 ['src/media/js/main.js'],
		style:	 'src/media/sass/screen.sass',
		img:	 'src/media/img/**/*.*',
		fonts:	 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg:	 'src/media/svg/**/*.svg',
		video:	 'src/media/video/**/*.*'
	},
	watch: {
		html:	 'src/**/*.nunj',
		js:		 'src/media/js/**/*.js',
		style:	 'src/media/sass/**/*.sass',
		img:	 'src/media/img/**/*.*',
		fonts:	 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg:	 'src/media/svg/**/*.svg'
	},
	clean: './build'
};

gulp.task('clean', function () {
	return gulp.src(PATHS.clean, {read: false})
		.pipe(rimraf({ force: true }));
});

gulp.task('html', function () {
	gulp.src(PATHS.src.html)
		.pipe(plumber({errorHandler: notify.onError({
			title: 'Nunjucks compilation error',
			message: 'Error: <%= error.message %>'
		})}))
		.pipe(nunjucksRender({
			src: 'src/templates',
			data: Object.assign(
				{
					PRODUCTION: PRODUCTION
				},
				require('./src/templates/global-data.json')
			),
			filters: require('./src/templates/lib/filters.js'),
			functions: require('./src/templates/lib/functions.js'),
			trimBlocks: true,
			lstripBlocks: true
		}))
        // .on('error', function(err) {
        //     console.log('ERROR!!!!!!!!!!!!!!!!!!!!!!!');
        // })
		.pipe(prettify({indent_char: ' ', indent_size: 4}))
		.pipe(gulp.dest(PATHS.build.html));
});

gulp.task('style:build', function () {

	var processors = [
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
			filterBy: function (image) {
				// Create sprite for ../sprites/ directory only
				return /sprites\/.*\.png$/gi.test(image.url);
			}
		})
	];

	gulp.src(PATHS.src.style)
		.pipe(plumber({errorHandler: notify.onError({
			title: 'SASS compilation error',
			message: 'Error: <%= error.message %>'
		})}))
		.pipe(gulpif(CONFIG.sourcemaps.css, sourcemaps.init()))
		.pipe(sass({
			outputStyle: 'compact',
			sourceMap: false,
			errLogToConsole: true,
			indentedSyntax: true
		}).on('error', function (err) {
			console.error('Error: ', err.message);
		}))
		.pipe(postcss(processors))
		.pipe(gulpif(CONFIG.compress.css, cssmin({processImport: false})))
		.pipe(gulpif(CONFIG.sourcemaps.css, sourcemaps.write()))
		.pipe(gulp.dest(PATHS.build.css));
});

gulp.task('image:build', function () {
	gulp.src(PATHS.src.img)
		.pipe(gulpif(CONFIG.compress.img, imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		})))
		.pipe(gulp.dest(PATHS.build.img));
});

gulp.task('fonts:build', function () {
	gulp.src(PATHS.src.fonts)
		.pipe(gulp.dest(PATHS.build.fonts));
});

gulp.task('svg:build', function() {
	return gulp.src(PATHS.src.svg)
		.pipe(svgmin(function (file){
			var prefix = path.basename(file.relative, path.extname(file.relative));
			return {
				plugins: [{
					removeUselessStrokeAndFill : false
				}, {
					cleanupIDs: {
						prefix: prefix + '-',
						minify: true
					}
				}]
			};
		}))
		.pipe(rename({prefix: 'icon-'}))
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest(PATHS.build.svg));
});

gulp.task('webpack', function () {
	var webpackConfig = require('./webpack.config.js');
	notify.on('error-compilation', function() {
		console.log('Compilation error');
	});
	return gulp.src(PATHS.src.js)
		.pipe(named())
		.pipe(webpackStream(webpackConfig, null))
		.on('compilation-error', notify.onError(function (err) {
			var msg = err.message.slice(0, 200).replace(/^\s+|\s+$/g, '') + '...';
			return {
				title: 'Webpack compilation error',
				message: 'Error: ' + msg
			};
		}))
		.pipe(gulp.dest(PATHS.build.js));
});


gulp.task('watch', function () {
	watch([PATHS.watch.html], function (event, cb) {
		gulp.start('html');
	});
	watch([PATHS.watch.style], function (event, cb) {
		gulp.start('style:build');
	});
	watch([PATHS.watch.img], function (event, cb) {
		gulp.start('image:build');
	});
	watch([PATHS.watch.svg], function (event, cb) {
		gulp.start('svg:build');
	});
	watch([PATHS.watch.fonts], function (event, cb) {
		gulp.start('fonts:build');
	});
});


var buildDeps = [
	'html',
	'style:build',
	'fonts:build',
	'image:build',
	'svg:build',
	'webpack'
];
if (PRODUCTION) {
	gulp.task('build', function() {
	  	runSequence('clean', buildDeps);
	});
} else {
	gulp.task('build', buildDeps);
}

gulp.task('default', [
	'build',
	'watch'
]);

if (!PRODUCTION) {
	var browserSync = require('browser-sync');
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
		middleware: [ historyApiFallback({
			htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
			rewrites: [
				{ from: /.*!test.json/, to: '/index.nunj'}
			]
		}) ]
	});
}
