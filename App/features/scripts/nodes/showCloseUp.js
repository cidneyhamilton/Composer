define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.imageName = attributes.imageName || null;
    };

    ctor.type = 'nodes.showCloseUp';
    ctor.displayName = 'Show Close Up';

    return ctor;
});