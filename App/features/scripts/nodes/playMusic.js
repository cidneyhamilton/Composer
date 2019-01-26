define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.musicTrack = attributes.musicTrack || null;
        this.channel = attributes.channel || 1
        this.loopType = attributes.loopType || 1
    };

    ctor.type = 'nodes.playMusic';
    ctor.displayName = 'Play Music';

    return ctor;
});