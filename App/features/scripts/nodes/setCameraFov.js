define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.wait = attributes.wait || false;
        this.fov = attributes.fov || 0;
      	this.time = attributes.time || 0;
    };

    ctor.type = 'nodes.setCameraFOV';
    ctor.displayName = 'Set Camera FOV';

    return ctor;
});