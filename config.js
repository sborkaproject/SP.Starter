export const PRODUCTION = process.env.NODE_ENV == 'production';

export default {
	sourcemaps: {
		css: !PRODUCTION,
		js: !PRODUCTION
	},
	compress: {
		css: PRODUCTION,
		js: PRODUCTION,
		images: PRODUCTION
	}
};
