define(function (require) {
    var system = require('durandal/system');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();

	// Reference to the actor
        this.actorId = attributes.actorId || null;

	// True if the actor should disappear gradually
	// End result of graudal removal is handled by the game engine
	this.hasTransition = attributes.hasTransition || false;
    };

    ctor.type = 'nodes.removeActor';
    ctor.displayName = 'Remove Actor';

    return ctor;
});
