define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};
  
        this.type = ctor.type;
        this.id = attributes.id || system.guid();

        this.target = attributes.target || 1;
		this.damageType = attributes.damageType || -1;
        this.amount = attributes.amount;
        this.canDie = attributes.canDie || false;
        this.isPercentage = attributes.isPercentage || false;
        this.showNotification = (attributes.showNotification == null) ? true : attributes.showNotification;;
    };

    ctor.type = 'nodes.changeHealth';
    ctor.displayName = 'Change Health';

    return ctor;
});