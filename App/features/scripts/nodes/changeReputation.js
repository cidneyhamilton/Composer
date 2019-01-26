define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.actorId = attributes.actorId;
        this.amount = attributes.amount;
        this.change = attributes.change || 1;
        this.notify = (attributes.notify == null) ? true : attributes.notify;
    };

    ctor.type = 'nodes.changeReputation';
    ctor.displayName = 'Reputation';

    return ctor;
});