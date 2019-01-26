define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        EventEditor = require('./eventEditor'),
        Index = require('features/shared/index');

    var ctor = function() {
        Index.call(this, assetDatabase.storyEvents, EventEditor);
    };

    Index.baseOn(ctor);

    return new ctor();
});