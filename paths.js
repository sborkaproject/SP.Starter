export default {
	build: {
		html: 'build',
		scripts: 'build/media/js/',
		styles: 'build/media/css/',
		images: 'build/media/img/',
		fonts: 'build/media/fonts/',
		sprites: 'build/media/img/sprites/',
		svg: 'build/media/svg/',
		videos: 'build/media/video/'
	},
	src: {
		templates: './src/templates/',
		nunj: 'src/templates/*.nunj',
		scripts: ['src/media/js/main.js'],
		styles: 'src/media/sass/screen.sass',
		images: 'src/media/img/**/*.*',
		fonts: 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg: 'src/media/svg/**/*.svg',
		videos: 'src/media/video/**/*.*'
	},
	watch: {
		nunj: 'src/templates/**/*.nunj',
		scripts: 'src/media/js/**/*.js',
		styles: 'src/media/sass/**/*.sass',
		images: 'src/media/img/**/*.*',
		fonts: 'src/media/fonts/**/*.*',
		sprites: 'src/media/img/sprites/*.png',
		svg: 'src/media/svg/**/*.svg'
	},
	clean: 'build/'
};
