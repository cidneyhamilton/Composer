define(function(require) {
    var serializer = require('plugins/serializer'),
        StoryEvent = require('./storyEvent');

    return {
        install: function() {
            serializer.registerType(StoryEvent);
        }
    };
});