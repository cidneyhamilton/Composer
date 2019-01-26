define(function (require) {
    var observable = require('plugins/observable');

    var ctor = function () {
    };

    ctor.prototype.activate = function (node, hour) {
        this.node = node;
        this.hour = hour;

        observable.defineProperty(this, 'description', function () {
            // If hour is defined, return a user-friendly description for it.
            if (this.hour) {
                return this.hour.getDescription();
            }
            return null;
        });
    }

    return ctor;
});