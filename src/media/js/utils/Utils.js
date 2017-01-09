
module.exports = {
    now: function () {
        let P = 'performance';
        if (window[P] && window[P]['now']) {
            this.now = function () { return window.performance.now(); };
        } else {
            this.now = function () { return +(new Date()); };
        }

        return this.now();
    },
};
