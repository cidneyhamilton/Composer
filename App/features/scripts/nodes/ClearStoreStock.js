define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.type = 'nodes.clearStoreStock';
    ctor.displayName = 'Clear Store Stock';

    return ctor;
});