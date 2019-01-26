define(function(require){
    var generateRegistry = require('./generateRegistry');

    return {
        run:function(context){
            return generateRegistry(context, 'storyEvents', 'StoryEvent', 'StoryEvents.cs', true);
        }
    };
});