define(function(require) {
    var serializer = require('plugins/serializer'),
        Prop = require('./prop');

    return {
        install: function() {
            serializer.registerType(Prop);
        }
    };
});