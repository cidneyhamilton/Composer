define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.look';
    ctor.displayName = 'Look';
    ctor.restrictions = ['actor','prop'];

    return ctor;
});