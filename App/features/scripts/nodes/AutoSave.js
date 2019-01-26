define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.type = 'nodes.autoSave';	// Our type used for serialization into unity
    ctor.displayName = 'AutoSave';	// The name displayed in the dropdown list

    return ctor;
});