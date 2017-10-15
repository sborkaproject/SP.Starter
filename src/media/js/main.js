var $ = global.$ = global.jQuery = require('./vendor/jquery-3.2.0.min');
var TweenMax = global.TweenMax = require('./vendor/tweenmax.min');
require('./vendor/jquery.gsap.min');
require('./utils/jqExtensions');

var App = global.App = new (function App() {
    var self = this;

    this.env = require('./utils/ENV');
    this.dom = require('./utils/DOM');
    this.utils = require('./utils/Utils');

    this.classes = {
        Callback: require('./classes/Callback'),
    };

    this.helpers = {
        SVGSprites: require('./helpers/SVGSprites'),
    };

    this.modules = {

    };

    // Startup
    $(function () {
        // Remove _loading modificator
        self.dom.$html.removeClass('_loading');
    });
})();

// App → ProjectName
global.ProjectName = global.App, delete global.App;
