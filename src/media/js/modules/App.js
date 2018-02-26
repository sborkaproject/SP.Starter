// import dom from '../utils/DOM'
// import env from '../utils/ENV'
import Test from './Test'
// import utils from '../utils/Utils'

class App {
    // this.classes = {
    //     Callback: require('../classes/Callback'),
    // };
	constructor() {
		this.init();
	}

    // this.helpers = {
    //     SVGSprites: require('../helpers/SVGSprites'),
    // };
	init() {
		console.log('init!');
        this.modules = {
            Test
        };
	}

    // Startup
    // $(() => {
    //     Remove _loading modificator
        // dom.$html.removeClass('_loading');
    // });
};

export default new App()
