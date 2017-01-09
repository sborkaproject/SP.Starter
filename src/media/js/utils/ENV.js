const dom = require('./DOM');

const MobileDetect = require('../vendor/mobile-detect.min');
const mobileDetectInstance = new MobileDetect(window.navigator.userAgent);

let testIE = function() {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ') > -1;
    let trident = ua.indexOf('Trident/') > -1;
    let edge = ua.indexOf('Edge/') > -1;
    return (msie > 0 || trident > 0 || edge > 0) ? true : false;
}

let env = {
    isMobile:			!!mobileDetectInstance.mobile(),
    isTablet:			!!mobileDetectInstance.tablet(),
    isPhone:			!!mobileDetectInstance.phone(),
    isDesktop:			!(!!mobileDetectInstance.mobile()),
    isMac:				navigator.platform.indexOf('Mac') > -1,
    isWin:				navigator.platform.indexOf('Win') > -1,
    width:				window.innerWidth,
    height:				window.innerHeight,
    detector:			mobileDetectInstance,
    SVGSupported:		!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect,
    isRetina:			window.devicePixelRatio > 1,
    isIE:				testIE(),
    hasPointerEvents:	!!('pointerEvents' in document.documentElement.style),
};

env.hasInlineVideo = (function () {
    if (env.isDesktop) {
        return true;
    } else {
        if (('playsInline' in document.createElement('video'))) {
            return true;
        } else {
            return window.matchMedia && window.matchMedia('(-webkit-video-playable-inline)').matches == true;
        }
    }
})();

let htmlClasses = [
	env.isDesktop ? '_desktop' : ('_mobile ' + (env.isPhone ? '_phone' : '_tablet')),
	env.isWin ? '_win' : '_mac',
];
env.isRetina && htmlClasses.push('_retina');

dom.$html.addClass(htmlClasses.join(' '));

dom.$window.on('resize', function (e) {
    env.width = window.innerWidth;
    env.height = window.innerHeight;
    env.maxSize = Math.max(window.innerWidth, window.innerHeight);
    env.minSize = Math.min(window.innerWidth, window.innerHeight);
});

module.exports = env;