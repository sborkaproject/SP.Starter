import { PRODUCTION } from './config';

const buildFolder = PRODUCTION ? 'build-production' : 'build';

export default {
	build: {
		html: `${buildFolder}`,
		scripts: `${buildFolder}/assets/js/`,
		styles: `${buildFolder}/assets/css/`,
		images: `${buildFolder}/assets/images/`,
		fonts: `${buildFolder}/assets/fonts/`,
		sprites: `${buildFolder}/assets/images/sprites/`,
		svg: `${buildFolder}/assets/svg/`,
		videos: `${buildFolder}/assets/video/`,
		robots: `${buildFolder}`,
	},
	src: {
		templates: './src/',
		nunj: 'src/pages/**/*.nunj',
		scripts: 'src/assets/js/index.js',
		styles: 'src/assets/styles/styles.scss',
		images: 'src/assets/images/**/*.*',
		imagesInline: 'src/assets/images/inline/',
		fonts: 'src/assets/fonts/**/*.*',
		sprites: 'src/assets/images/sprites/*.png',
		svg: 'src/assets/svg/**/*.svg',
		videos: 'src/assets/video/**/*.*',
		robots: `src/assets/robots/*.*`,
	},
	watch: {
		nunj: ['src/**/*.nunj', 'global-data.json'],
		scripts: 'src/**/*.js',
		styles: 'src/**/*.scss',
		images: 'src/assets/images/**/*.*',
		fonts: 'src/assets/fonts/**/*.*',
		sprites: 'src/assets/images/sprites/*.png',
		svg: 'src/assets/svg/**/*.svg',
		robots: `src/assets/robots/*.*`,
	},
	clean: `${buildFolder}/`,
};
