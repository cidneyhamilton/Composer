define(function(require) {
    var serializer = require('plugins/serializer'),
        Scene = require('./scene');

    return {
        install: function() {
            serializer.registerType(Scene);
        }
    };
});