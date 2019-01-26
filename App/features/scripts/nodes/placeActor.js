define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId || null;
        this.spawnId = attributes.spawnId || null;
        this.pose = attributes.pose || null;
        this.behaviour = attributes.behaviour || null;
		this.immediate = attributes.immediate || null;
    };

    ctor.type = 'nodes.placeActor';
    ctor.displayName = 'Place Actor';

    return ctor;
});