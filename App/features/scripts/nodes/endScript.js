define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};
        this.type = ctor.type;
    };

    ctor.type = 'nodes.endScript';	// Our type used for serialization into unity
    ctor.displayName = 'EndScript';	// The name displayed in the dropdown list

    return ctor;
});