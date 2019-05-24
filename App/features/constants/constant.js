define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.id = attributes.id;
        this.name = attributes.name;
        this.entries = attributes.entries || [];
    };

    ctor.type = 'constant';

    return ctor;
});