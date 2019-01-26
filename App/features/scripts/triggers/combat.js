define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.combat';
    ctor.displayName = 'Combat';
    ctor.restrictions = ['actor'];

    return ctor;
});