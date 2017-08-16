import gulp from 'gulp'
import historyApiFallback from 'connect-history-api-fallback'
import Rx from 'rx'
import chokidar from 'chokidar'

gulp.task('browserSync', () => {
	const browserSync = require('browser-sync').create();
	browserSync.init({
		server: {
			baseDir: 'build',
		},
		host: 'localhost',
		port: 9000,
		logPrefix: 'SP.Starter',
		open: false,
		files: [
			'build/media/css/*.css'
		],
		middleware: [historyApiFallback({
			htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
			rewrites: [
				{from: /.*!test.json/, to: '/index.html'}
			]
		})]
	});

	/**
	 * Create a stream of file-change events
	 */
	Rx.Observable.create(function (observer) {
		const watcher = chokidar
			.watch([
				'build/media/js/*.js',
				'build/*.html',
			], {ignoreInitial: true})
			.on('all', function (event, file) {
				observer.onNext({event, file});
			});
		return function () {
			watcher.close();
		};
	})
	/**
	 * Wait for 300 milliseconds of event silence before emitting
	 */
		.debounce(300)
		/**
		 * Only look at add/change events
		 */
		.filter(function (x) {
			return x.event === 'add' || x.event === 'change';
		})
		/**
		 * Finally reload the browser
		 */
		.subscribe(function (x) {
			browserSync.reload();
		});
});
