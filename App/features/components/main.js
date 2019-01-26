define(function(require) {
    var serializer = require('plugins/serializer'),
        ControllerIndex = require('./index');

    return {
        install: function() {
            ControllerIndex.allComponents.forEach(function(type) { serializer.registerType(type); });
        }
    };
});