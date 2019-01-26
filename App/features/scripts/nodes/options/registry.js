define(function(require) {
    var serializer = require('plugins/serializer');

    return {
        availableOptions: [
            require('./textOption')
        ],
        install: function() {
            this.availableOptions.forEach(function(type) { serializer.registerType(type); });
        }
    };
});