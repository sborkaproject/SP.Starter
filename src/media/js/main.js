var $ = global.$ = global.jQuery = require('./vendor/jquery-3.1.0.min.js');

var TweenMax = global.TweenMax = require('./vendor/tweenmax.min.js');
require('./vendor/jquery.gsap.min.js');

require('./vendor/jquery.helpers.js');

var App = global.App = new (function App() {
    var self = this;

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
    this.classes = {};

    // Modules
    this.modules = {};

    // Helpers
    this.helpers = {};

    // Utils
    this.utils = {
        now: function () {
            var P = 'performance';
            if (window[P] && window[P]['now']) {
                this.now = function () { return window.performance.now(); };
            } else {
                this.now = function () { return +(new Date()); };
            }

            return this.now();
        },
    };

    // Startup

    $(function () {
        // Module init order is important!
        self.modules.Module.init();

        // Remove _loading modificator
        self.dom.$html.removeClass('_loading');
    });
})();

// import classes first
App.classes.Callback = require('./classes/Callback');

// import modules
App.modules.Module = require('./modules/Module');

// App -> ProjectName
global.ProjectName = global.App, delete global.App;
