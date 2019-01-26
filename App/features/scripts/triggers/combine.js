define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.combine';
    ctor.displayName = 'Combine';
    ctor.restrictions = ['prop'];

    return ctor;
});