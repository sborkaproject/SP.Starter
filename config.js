export const IS_PRODUCTION = process.env.NODE_ENV == 'production';

export default {
	sourcemaps: {
		css: !IS_PRODUCTION,
		js: !IS_PRODUCTION
	},
	compress: {
		css: IS_PRODUCTION,
		js: IS_PRODUCTION,
		img: IS_PRODUCTION
	}
};
