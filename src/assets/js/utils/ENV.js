const envObject = window.environmentObject;

const env = {
	// Platform
	isMobile: envObject.platform === '_mobile',
	isDesktop: envObject.platform === '_desktop',

	// OS
	isMac: envObject.os === '_mac',
	isWin: envObject.os === '_win',
	isLinux: envObject.os === '_linux',
	isAndroid: envObject.os === '_android',
	isIOS: envObject.os === '_ios',

	// Browsers
	isFF: envObject.browser === '_ff',
	isOpera: envObject.browser === '_opera',
	isYandex: envObject.browser === '_yandex',
	isIE: envObject.browser === '_ie',
	isEdge: envObject.browser === '_edge',
	isChrome: envObject.browser === '_chrome',
	isSafari: envObject.browser === '_safari',

	// Dev environment
	isLocal: envObject.isLocal,
};

window.environmentObject = null;
delete window.environmentObject;

export default env;
