var inventoryPicklists;

define(function(require) {
    if (!inventoryPicklists) {
        inventoryPicklists = require('features/constants/inventoryPicklists');
    }
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.throwAction = attributes.throwAction || 0;
        this.spawnEffect = attributes.spawnEffect || 0;
        this.modelType = attributes.modelType || 0;
        this.canRetrieve = attributes.canRetrieve || false;
    };

    ctor.displayName = 'Throwing Component';
    ctor.type = 'components.throwingComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});