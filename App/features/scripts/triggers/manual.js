define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.manual';
    ctor.displayName = 'Manual';
    ctor.restrictions = ['actor', 'scene','storyEvent', 'prop'];
    return ctor;
});