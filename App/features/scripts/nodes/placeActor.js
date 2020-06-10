define(function(require) {
    var system = require('durandal/system');
    var selectedGame = require('features/projectSelector/index');
    
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId || null;
        this.spawnId = attributes.spawnId || null;
        this.pose = attributes.pose || null;
        this.behaviour = attributes.behaviour || null;
	this.immediate = attributes.immediate || null;

	this.advanced = selectedGame.activeProject.format == 'json';
    };

    ctor.type = 'nodes.placeActor';
    ctor.displayName = 'Place Actor';

    return ctor;
});
