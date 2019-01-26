define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.poisonAction = attributes.poisonAction || 0;
        this.amount = attributes.amount || 0;
    };

    ctor.type = 'nodes.poisonCounters';
    ctor.displayName = 'Poison Counters';

    return ctor;
});