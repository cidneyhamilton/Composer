define(function(require) {
    var system = require('durandal/system');

   var ctor = function(attributes) {
        attributes = attributes || {};
        this.type = ctor.type;
        this.id = attributes.id || system.guid();
    };

    ctor.type = 'nodes.sellAllLoot';
    ctor.displayName = 'Sell All Loot';

    return ctor;
});