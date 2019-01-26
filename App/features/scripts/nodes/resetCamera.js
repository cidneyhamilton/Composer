define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.wait = attributes.wait || false;
      	this.time = attributes.time || 0;
    };

    ctor.type = 'nodes.resetCamera';
    ctor.displayName = 'ResetCamera';

    return ctor;
});