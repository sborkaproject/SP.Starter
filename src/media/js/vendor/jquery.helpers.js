// JQ helpers
(function( $ ) {
	var $body = $('body');

    $.fn.outerClick = function (handler) {
        var self = this;
        $body.on('mousedown touchstart', function (e) {
            var target = e.target;

            if (self.is(target)) {
                return;
            }

            if (self.has(target).length) {
                return;
            }

            handler(e);
        });

        return this;
    };

	$.fn.outline = function( state ){
		return this.css({ outline: state === false ? '' : '1px solid red' });
	}

	$.fn.nope = function( state ){
		return state === false ? this.removeClass('no-pe') : this.addClass('no-pe');
	}

	var delayedFocusTimeout;
	$.fn.delayedFocus = function( delay ){
		clearTimeout(delayedFocusTimeout);

		var self = this;
		delayedFocusTimeout = setTimeout(function(){
			self.focus();
		}, delay || 150);

		return this;
	}

}( jQuery ));