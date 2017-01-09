function Module1(){
	console.log('Module 1 init')
}

Module1.prototype = {
	testMethod: function(){
		console.log('Module 1 test method ok')
	}
};

module.exports = new Module1();