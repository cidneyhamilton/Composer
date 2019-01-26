define(function (require) {
    var observable = require('plugins/observable');

    var ctor = function () {
    };

    ctor.prototype.activate = function (node, day) {
        this.node = node;
        this.day = day;

        observable.defineProperty(this, 'description', function () {
            // If day is defined, return a user-friendly description for it.
            if (this.day) {
                return this.day.getDescription();
            }
            return null;
        });
    }

    return ctor;
});