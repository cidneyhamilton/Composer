var inventoryPicklists;

define(function(require) {
    if (!inventoryPicklists) {
        inventoryPicklists = require('features/constants/inventoryPicklists');
    }

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.toolClass = attributes.toolClass || 0;
        this.usagesRemaining = attributes.usagesRemaining || -1;
        this.bonusSkill = attributes.bonusSkill || 0;
        this.breakPercentage = attributes.breakPercentage || 50;
        this.unbreakable = false; 
    };

    ctor.displayName = 'PickLockComponent';
    ctor.type = 'components.pickLockComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});