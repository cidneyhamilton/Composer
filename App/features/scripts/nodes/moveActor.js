define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId || null;
        this.propId = attributes.propId || null;
		this.movement = attributes.movement || null;
        this.wait = attributes.wait;
    };

    ctor.type = 'nodes.moveActor';
    ctor.displayName = 'Move Actor';

    return ctor;
});