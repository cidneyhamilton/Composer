define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.bootstrap';
    ctor.displayName = 'Bootstrap';
    ctor.restrictions = ['scene'];      // Should really just be the start scene
    return ctor;
});