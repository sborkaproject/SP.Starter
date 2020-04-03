import '@babel/polyfill';

// import jquery from 'jquery';
// global.jquery = jquery;

import { gsap } from 'gsap';
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

global.gsap = gsap;
gsap.defaults(
	{
		overwrite: 'auto'




		 });

// prettier-ignore
global.ProjectApp = new function ProjectApp() { // eslint-disable-line
	this.env = require('./utils/env').default;
	this.utils = require('./utils/utils').default;

	this.classes = {
		Signal: require('./classes/Signal').default
	};

	this.components = {

		
	}
	this.helpers = {


	};
	this.modules = {


	};

	document.addEventListener('DOMContentLoaded',e => {
		document.documentElement.classList.remove('_loading')
	});
}();

if (module.hot) {
	module.hot.accept();
}
