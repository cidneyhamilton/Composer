define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.enter';
    ctor.displayName = 'Enter';
    ctor.restrictions = ['scene', 'storyEvent'];

    return ctor;
});