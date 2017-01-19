const $ = global.$ = global.jQuery = require('./vendor/jquery-3.1.0.min');

const TweenMax = global.TweenMax = require('./vendor/tweenmax.min');
require('./vendor/jquery.gsap.min');

require('./utils/jqExtensions');

let App = global.App = new (function App() {
    let self = this;

    // Environment settings
    var MobileDetect = require('./vendor/mobile-detect.min.js');
    var mobileDetectInstance = new MobileDetect(window.navigator.userAgent);

    this.env = {
        isMobile: !!mobileDetectInstance.mobile(),
        isTablet: !!mobileDetectInstance.tablet(),
        isPhone: !!mobileDetectInstance.phone(),
        isDesktop: !(!!mobileDetectInstance.mobile()),
        isMac: navigator.platform.indexOf('Mac') > -1,
        isWin: navigator.platform.indexOf('Win') > -1,
        width: window.innerWidth,
        height: window.innerHeight,
        detector: mobileDetectInstance,
        SVGSupported: !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect,
    };

    // Base DOM structure
    this.dom = {
        $body: $('body'),
        $html: $('html'),
        $document: $(document),
        $window: $(window).on('resize orientationchange', function (e) {
            self.env.width = window.innerWidth;
            self.env.height = window.innerHeight;
            self.env.maxSize = Math.max(window.innerWidth, window.innerHeight);
            self.env.minSize = Math.min(window.innerWidth, window.innerHeight);
        }),
    };

    // HTML classes
    this.env.isMobile   && this.dom.$html.addClass('_mobile');
    this.env.isTablet   && this.dom.$html.addClass('_tablet');
    this.env.isPhone    && this.dom.$html.addClass('_phone');
    this.env.isDesktop  && this.dom.$html.addClass('_desktop');
    this.env.isMac      && this.dom.$html.addClass('_mac');
    this.env.isWin      && this.dom.$html.addClass('_win');
    this.env = require('./utils/ENV');
    this.dom = require('./utils/DOM');
    this.utils = require('./utils/Utils');

    // SVG Sprites
    function addSVGSprite(data) {
        $('<div style="width:0;height:0;overflow:hidden"></div>')
         .prependTo(document.body)
         .html(typeof XMLSerializer != 'undefined'
          ? (new XMLSerializer()).serializeToString(data.documentElement)
          : $(data.documentElement).html()
         );
    }

    $.get('media/svg/sprite.svg', addSVGSprite);

    // Classes
    this.classes = {
        Callback: require('./classes/Callback'),
    };

    // Modules
    this.modules = {
        Module1: require('./modules/Module1'),
        Module2: require('./modules/Module2'),
    };

    // Startup
    $(function () {
        self.modules.Module2.testMethod();

        // Remove _loading modificator
        self.dom.$html.removeClass('_loading');
    });
})();

// App -> ProjectName
global.ProjectName = global.App, delete global.App;
