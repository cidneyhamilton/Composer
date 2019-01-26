define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.buffType = attributes.buffType || 1;
        this.duration = attributes.duration || 60;  // Minutes
        this.targetData = attributes.targetData || 0;
        this.isPercentage = attributes.isPercentage || 0;
        this.value = attributes.value || 5;
        this.namedSource = attributes.namedSource || "";
    };

    ctor.type = 'nodes.buffAdd';
    ctor.displayName = 'Buff Add';

    return ctor;
});