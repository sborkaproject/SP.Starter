export default {
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
		html: 'src/templates/**/*.nunj',
		js: 'src/media/js/**/*.js',
		style: 'src/media/sass/**/*.sass',
		img: 'src/media/img/**/*.*',
		fonts: 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg: 'src/media/svg/**/*.svg'
	},
	clean: 'build/'
};
