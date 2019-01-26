define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.interact';
    ctor.displayName = 'Interact';
    ctor.restrictions = ['prop', 'actor'];

    return ctor;
});