﻿define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.sceneMusic';
    ctor.displayName = 'Scene Music';
    ctor.restrictions = ['scene'];
    return ctor;
});