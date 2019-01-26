define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.message = attributes.message || '';
        this.commentor = attributes.commentor || '';
    };

    ctor.type = 'nodes.comment';	// Our type used for serialization into unity
    ctor.displayName = 'Comment';	// The name displayed in the dropdown list

    return ctor;
});