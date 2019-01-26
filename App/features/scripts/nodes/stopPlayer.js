define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};
        this.type = ctor.type;
    };

    ctor.type = 'nodes.stopPlayer';
    ctor.displayName = 'Stop Player';

    return ctor;
});