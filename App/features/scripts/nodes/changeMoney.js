define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.amount = attributes.amount;
        this.change = attributes.change || 1;
        this.currency = attributes.currency || 0;
    };

    ctor.type = 'nodes.changeMoney';
    ctor.displayName = 'Player Value';

    return ctor;
});