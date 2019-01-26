define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId || null;
        this.animationName = attributes.animationName || null;
        this.wait = attributes.wait;
    };

    ctor.type = 'nodes.playAnimation';
    ctor.displayName = 'Play Animation';

    return ctor;
});