function InvisibleContainer() {
	this.$container = $('<div class="invisible-container"></div>').prependTo(document.body);
}
InvisibleContainer.prototype = {
	add: function(html) {
		return $(html).appendTo(this.$container);
	},
};

module.exports = new InvisibleContainer();
