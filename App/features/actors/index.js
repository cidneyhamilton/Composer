define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        ActorEditor = require('./actorEditor'),
        Index = require('features/shared/index');

    var ctor = function() {
        Index.call(this, assetDatabase.actors, ActorEditor);
    };

    Index.baseOn(ctor);

    return new ctor();
});