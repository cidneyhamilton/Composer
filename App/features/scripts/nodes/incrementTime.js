define(function (require) {
    var system = require('durandal/system');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.days = attributes.days || 0;
        this.hours = attributes.hours || 0;
        this.minutes = attributes.minutes || 0;
    };

    ctor.type = 'nodes.incrementTime';
    ctor.displayName = 'Increment Time';

    return ctor;
});