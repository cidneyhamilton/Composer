var inventoryPicklists;

define(function(require) {
    var system = require('durandal/system');
    if (!inventoryPicklists) {
        inventoryPicklists = require('features/constants/inventoryPicklists');
    }

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.itemTypeFilter = attributes.itemTypeFilter || null;
        this.isGiftFilter = attributes.isGiftFilter || false;
        this.specificItemFilter = attributes.specificItemFilter || [];
    };

    ctor.type = 'nodes.selectInventoryItem';
    ctor.displayName = 'Select Inventory Item';

    return ctor;
});