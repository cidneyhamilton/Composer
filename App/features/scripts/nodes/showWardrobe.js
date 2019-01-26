define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};
        this.type = ctor.type;
    };

    ctor.type = 'nodes.showWardrobe';
    ctor.displayName = 'Show Wardrobe';

    return ctor;
});