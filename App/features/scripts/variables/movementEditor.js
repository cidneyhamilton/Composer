define(function (require) {
    var observable = require('plugins/observable');

    var ctor = function () {
    };

    ctor.prototype.activate = function (node, value) {
        this.node = node;
        this.value = value;

        observable.defineProperty(this, 'description', function () {
            // If day is defined, return a user-friendly description for it.
            if (this.value) {
                return this.value.getDescription();
            }
            return null;
        });
    }

    return ctor;
});