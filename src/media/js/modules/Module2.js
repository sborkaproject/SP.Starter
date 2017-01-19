var Module1 = require('./Module1');

var env = require('../utils/ENV');
var dom = require('../utils/DOM');
var utils = require('../utils/Utils');

var Callback = require('../classes/Callback');

function Module2(){
	console.log('Module 2 init')
}

Module2.prototype = {
	testMethod: function(){
		console.log('Module 2 test method');
		Module1.testMethod();
	}
};

module.exports = new Module2();