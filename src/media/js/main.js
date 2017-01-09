const $ = global.$ = global.jQuery = require('./vendor/jquery-3.1.0.min');

const TweenMax = global.TweenMax = require('./vendor/tweenmax.min');
require('./vendor/jquery.gsap.min');

require('./utils/jqExtensions');

let App = global.App = new (function App() {
    let self = this;

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
