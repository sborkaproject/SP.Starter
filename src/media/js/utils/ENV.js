var dom = require('./DOM');

var MobileDetect = require('../vendor/mobile-detect.min');
var mobileDetectInstance = new MobileDetect(window.navigator.userAgent);

var env = {
    isMobile:           !!mobileDetectInstance.mobile(),
    isTablet:           !!mobileDetectInstance.tablet(),
    isPhone:            !!mobileDetectInstance.phone(),
    isDesktop:          !(!!mobileDetectInstance.mobile()),
    isMac:              navigator.platform.indexOf('Mac') > -1,
    isWin:              navigator.platform.indexOf('Win') > -1,
    width:              window.innerWidth,
    height:             window.innerHeight,
    detector:           mobileDetectInstance,
    isRetina:           window.devicePixelRatio > 1,
};

var htmlClasses = [
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
}).trigger('resize');


var SCROLLED = '_scrolled';

dom.$window.scroll(function (e) {
    if (dom.$window.scrollTop() > 0) {
        dom.$html.addClass(SCROLLED);
    } else {
        dom.$html.removeClass(SCROLLED);
    }

    env.scrollTop = dom.$window.scrollTop();
});

module.exports = env;