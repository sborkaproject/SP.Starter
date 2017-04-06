var dom = require('./DOM');
var $body = dom.$body;

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

$.fn.nope = function (state) {
    return state === false ? this.removeClass('no-pe') : this.addClass('no-pe');
};

$.fn.outline = function (state) {
    return this.css({ outline: state === false ? '' : '1px solid red' });
};

var delayedFocusTimeout;
$.fn.delayedFocus = function (delay) {
    clearTimeout(delayedFocusTimeout);

    var self = this;
    delayedFocusTimeout = setTimeout(function () {
        self.focus();
    }, delay || 150);

    return this;
};

$.fn.focusOnEnd = function () {
    this.focus().val(this.val());
    return this;
};

$.fn.delayedFocusOnEnd = function (delay) {
    clearTimeout(delayedFocusTimeout);

    var self = this;
    delayedFocusTimeout = setTimeout(function () {
        self.focus().val(self.val());
    }, delay || 150);

    return this;
};
