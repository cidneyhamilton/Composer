define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.message = attributes.message || '';
    };

    ctor.type = 'nodes.trace';
    ctor.displayName = 'Trace';

    return ctor;
});