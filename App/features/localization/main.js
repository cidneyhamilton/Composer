define(function(require) {
    var serializer = require('plugins/serializer');

    return {
        install: function() {
            serializer.registerType(require('./group'));
        }
    };
});