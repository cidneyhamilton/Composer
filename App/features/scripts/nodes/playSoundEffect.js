define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.soundEffectName = attributes.soundEffectName || null;
        this.wait = attributes.wait || false;
    };

    ctor.type = 'nodes.playSoundEffect';
    ctor.displayName = 'Play Sound Effect';

    return ctor;
});