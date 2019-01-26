define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.movie = attributes.movie || null;
        this.canSkip = attributes.canSkip || false;
    };

    ctor.type = 'nodes.playMovie';
    ctor.displayName = 'Play Movie';

    return ctor;
});