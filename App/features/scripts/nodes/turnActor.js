define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId || null;
        this.propId = attributes.propId || null;
        this.wait = attributes.wait;

        this.scope = attributes.scope || 'prop';
        this.targetActorId = attributes.targetActorId || null;
    };

    ctor.type = 'nodes.turnActor';
    ctor.displayName = 'Turn Actor';

    return ctor;
});