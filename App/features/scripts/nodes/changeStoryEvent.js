define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.storyEventId = attributes.storyEventId || null;
    };

    ctor.type = 'nodes.changeStoryEvent';
    ctor.displayName = 'Change Story Event';

    return ctor;
});