define(function (require) {
    var observable = require('plugins/observable');

    var ctor = function () {
    };

    ctor.prototype.activate = function(node, literal) {
        this.node = node;
        this.literal = literal;

        observable.defineProperty(this, 'description', function () {
            // If literal is defined, return a user-friendly description for it.
            if (this.literal) {
                return this.literal.getDescription();
            }
            return null;
        });
    }

    return ctor;
});