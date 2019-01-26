define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.sceneId = attributes.sceneId || null;
        this.spawnId = attributes.spawnId || null;
        this.fadeTime = attributes.fadeTime || 2.0;
    };

    ctor.type = 'nodes.changeScene';
    ctor.displayName = 'Change Scene';

    return ctor;
});
