define(function(require) {
    var serializer = require('plugins/serializer'),
        Actor = require('./actor');

    return {
        install: function() {
            serializer.registerType(Actor);
        }
    };
});