var dom = require('./DOM');

var MobileDetect = require('../vendor/mobile-detect.min');
var mobileDetectInstance = new MobileDetect(window.navigator.userAgent);

/*
var testIE = function() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ') > -1;
    var trident = ua.indexOf('Trident/') > -1;
    var edge = ua.indexOf('Edge/') > -1;
    return (msie > 0 || trident > 0 || edge > 0) ? true : false;
}
*/

/*
var testWebGL = function() {
    try{
        var canvas = document.createElement( 'canvas' );
        return !!(window.WebGLRenderingContext && (canvas.getContext( 'webgl' ) || canvas.getContext('experimental-webgl')));
    }catch( e ) { return false; }
};
*/

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
    // SVGSupported:        !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect,
    isRetina:           window.devicePixelRatio > 1,
    // isIE:                testIE(),
    // hasPointerEvents:    !!('pointerEvents' in document.documentElement.style),
    // hasWebGL:           testWebGL()
};

/*
env.hasInlineVideo = (function () {
    var result = false;
    if (env.isDesktop) {
        result = true;
    } else {
        var isWhitelisted = 'object-fit' in document.head.style && /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia('(-webkit-video-playable-inline)').matches;
        if(isWhitelisted){
            result = true;
        } else {
            var testVideo = document.createElement('video');
            if (('playsInline' in testVideo)) {
                result = testVideo.playsInline == true;
            }
            if(!result){
                result = window.matchMedia && window.matchMedia('(-webkit-video-playable-inline)').matches == true;
            }

            if(!result){
                document.body.appendChild(testVideo);

                var sourceMP4 = document.createElement('source');
                sourceMP4.type = 'video/mp4';
                sourceMP4.src = 'data:video/mp4;base64,dGJsAAAAxHN0c2QAAAAAAAAAAQAAALRtcDR2AAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAgACABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAXmVzZHMAAAAAA4CAgE0AAQAEgICAPyARAAAAAAMNQAAAAAAFgICALQAAAbABAAABtYkTAAABAAAAASAAxI2IAMUARAEUQwAAAbJMYXZjNTMuMzUuMAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAASAAAAAQAAABRzdGNvAAAAAAAAAAEAAAAsAAAAYHVkdGEAAABYbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAraWxzdAAAACOpdG9vAAAAG2RhdGEAAAABAAAAAExhdmY1My4yMS4x';
                testVideo.appendChild(sourceMP4);

                testVideo.play();

                result = !testVideo.webkitDisplayingFullscreen;
                if(!result){
                    result = Document.fullscreenElement == testVideo;
                }

                try{
                    //testVideo.pause();
                    document.body.removeChild(testVideo);
                }catch(e){}

                testVideo.style.display = 'none';
            }
        }
    }

    return result;
})();
*/

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

dom.$window.scroll(function (e) {
    if (dom.$window.scrollTop() > 0) {
        dom.$html.addClass('_scrolled');
    } else {
        dom.$html.removeClass('_scrolled');
    }

    env.scrollTop = dom.$window.scrollTop();
});

module.exports = env;
