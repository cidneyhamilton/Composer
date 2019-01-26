define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.onUse';
    ctor.displayName = 'Use';
    ctor.restrictions = ['prop'];
    return ctor;
});