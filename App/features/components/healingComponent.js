var heroStatusEffects;

define(function(require) {
    if (!heroStatusEffects) {
        heroStatusEffects = require('features/constants/heroStatusEffects');
    }
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.DamageValueMin = attributes.DamageValueMin || 1;
        this.DamageValueMax = attributes.DamageValueMax || 1;

        this.IsPercentage = attributes.IsPercentage;
        if (this.IsPercentage == null)
            this.IsPercentage = true;

        this.Radius = attributes.Radius || 0;

        this.CuresDebuff = attributes.CuresDebuff || 0;
    };

    ctor.displayName = 'HealingComponent';
    ctor.type = 'components.healingComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});