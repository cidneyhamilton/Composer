define(function (require) {
    var system = require('durandal/system');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
    };

    ctor.type = 'nodes.gameOver';
    ctor.displayName = 'Game Over';

    ctor.prototype.localize = function (context) {
        delete this.text;
    };

    return ctor;
});