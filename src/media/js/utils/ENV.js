const MobileDetect = require('mobile-detect');

const dom = require('./DOM');

const mobileDetectInstance = new MobileDetect(window.navigator.userAgent);

const ua = navigator.userAgent.toLowerCase();
const an = navigator.appName.toLowerCase();
const pl = navigator.platform;

const env = {
	isMobile: !!mobileDetectInstance.mobile(),
	isTablet: !!mobileDetectInstance.tablet(),
	isPhone: !!mobileDetectInstance.phone(),
	isDesktop: !mobileDetectInstance.mobile(),

	isMac: pl.indexOf('Mac') > -1,
	isWin: pl.indexOf('Win') > -1,
	isLinux: pl.indexOf('Linux') > -1,
	width: window.innerWidth,
	height: window.innerHeight,
	detector: mobileDetectInstance,
	isRetina: window.devicePixelRatio > 1,
	isFF: ua.indexOf('firefox') > -1,
	isOpera: ua.indexOf('opr') > -1,
	isYandex: ua.indexOf('yabrowser') > -1,
	isIE: ua.indexOf('trident') > -1 || an.indexOf('explorer') > -1 || an.indexOf('msie') > -1,
	isChrome: ua.indexOf('chrome') > -1,
	isSafari: ua.indexOf('safari') > -1 && ua.indexOf('chrome') == -1,
	isIOS: (/ipad|iphone|ipod/.test(ua) && !window.MSStream) || (!!pl && /iPad|iPhone|iPod/.test(pl)),
	isIPhoneX: /mac os x/.test(ua) || (window.screen.width === 375 && window.screen.height === 812),
};

let platformClass = '';
if (env.isWin) {
	platformClass = '_win';
} else if (env.isIOS) {
	platformClass = '_ios';
} else if (env.isMac) {
	platformClass = '_mac';
} else if (env.isLinux) {
	platformClass = '_linux';
}

let browserClass = '';
if (env.isFF) {
	browserClass = '_ff';
} else if (env.isOpera) {
	browserClass = '_opera';
} else if (env.isYandex) {
	browserClass = '_yandex';
} else if (env.isIE) {
	browserClass = '_ie';
} else if (env.isChrome) {
	browserClass = '_chrome';
} else if (env.isSafari) {
	browserClass = '_safari';
}

const htmlClasses = [
	env.isDesktop ? '_desktop' : '_mobile ' + (env.isPhone ? '_phone' : '_tablet'),
	platformClass,
	browserClass,
];

env.isRetina && htmlClasses.push('_retina');
env.isIPhoneX && htmlClasses.push('_iphonex');

dom.$html.addClass(htmlClasses.join(' '));

module.exports = env;
