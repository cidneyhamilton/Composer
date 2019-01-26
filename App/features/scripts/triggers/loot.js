define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.loot';
    ctor.displayName = 'Loot';
    ctor.restrictions = ['actor'];

    return ctor;
});