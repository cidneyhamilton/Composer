define(function(require) {
    var system = require('durandal/system');

   var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.propId = attributes.propId;
        this.sceneId = attributes.sceneId || 'a2508b7e-a177-4a96-93bd-4d8ab88dffc4';
        this.change = attributes.change || 1;
        this.count = attributes.count || 1;
        this.notify = (attributes.notify == null) ? true : attributes.notify;
    };

    ctor.type = 'nodes.changeInventory';
    ctor.displayName = 'Inventory';

    return ctor;
});