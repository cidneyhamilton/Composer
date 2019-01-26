define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.equipItem';
    ctor.displayName = 'EquipItem';
    ctor.restrictions = ['prop'];       // Actually Inventory Item
    return ctor;
});