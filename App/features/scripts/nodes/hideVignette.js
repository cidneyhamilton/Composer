﻿define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.waitForSeconds = attributes.waitForSeconds || 1;
    };

    ctor.type = 'nodes.hideVignette';
    ctor.displayName = 'Hide Vignette';

    return ctor;
});