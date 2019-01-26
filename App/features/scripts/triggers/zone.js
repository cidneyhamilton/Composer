define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.zone';
    ctor.displayName = 'Zone';
    ctor.restrictions = ['scene'];

    return ctor;
});