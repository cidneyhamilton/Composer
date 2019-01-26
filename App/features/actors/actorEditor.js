define(function(require) {
    var Editor = require('features/shared/editor'),
        ActorDetail = require('./actorDetail');

    var ctor = function(owner, entry) {
        Editor.call(this, owner, entry, new ActorDetail(), 'actorId');
    };

    Editor.baseOn(ctor);

    return ctor;
});