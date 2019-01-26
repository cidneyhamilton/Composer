define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};
        this.type = ctor.type;
    };

    ctor.type = 'nodes.showStore';
    ctor.displayName = 'Show Store';

    return ctor;
});