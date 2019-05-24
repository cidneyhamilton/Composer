define(function(require) {
    var system = require('durandal/system'),
        loadedConstants = require('features/constants/loadedConstants');

   var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.propId = attributes.propId;
        this.sceneId = attributes.sceneId || loadedConstants.inventorySceneId;
        this.change = attributes.change || 1;
        this.count = attributes.count || 1;
        this.notify = (attributes.notify == null) ? true : attributes.notify;
    };

    ctor.type = 'nodes.changeInventory';
    ctor.displayName = 'Inventory';

    return ctor;
});