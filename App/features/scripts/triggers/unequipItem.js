define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.unequipItem';
    ctor.displayName = 'UnequipItem';
    ctor.restrictions = ['prop'];       // Actually Inventory Item
    return ctor;
});