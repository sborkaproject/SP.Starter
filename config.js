export const PRODUCTION = process.env.NODE_ENV == 'production';

export default {
	sourcemaps: {
		styles: PRODUCTION,
	},
	compress: {
		styles: PRODUCTION,
		images: PRODUCTION
	}
};
