﻿define(function (require) {
    var system = require('durandal/system');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.day = attributes.day || -1;
        this.hour = attributes.hour || 0;
        this.minute = attributes.minute || 0;
        this.notify = attributes.notify || false;
    };

    ctor.type = 'nodes.setTime';
    ctor.displayName = 'Set Time';

    return ctor;
});