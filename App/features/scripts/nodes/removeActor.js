define(function (require) {
    var system = require('durandal/system');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        //this.sceneId = attributes.sceneId || null;
        //this.visible = attributes.visible || false;
        this.actorId = attributes.actorId || null;
    };

    ctor.type = 'nodes.removeActor';
    ctor.displayName = 'Remove Actor';

    return ctor;
});