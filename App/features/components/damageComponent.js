var damageSourceTypes;

define(function(require) {
    if (!damageSourceTypes) {
        damageSourceTypes = require('features/constants/damageSourceTypes');
    }

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.DamageValueMin = attributes.DamageValueMin || 1;
        this.DamageValueMax = attributes.DamageValueMax || 1;

        this.IsPercentage = attributes.IsPercentage || false;

        this.DamageSourceType = attributes.DamageSourceType || 0;
        this.Radius = attributes.Radius || 0;
        this.alwaysHit = attributes.alwaysHit || 0;
    };

    ctor.displayName = 'DamageComponent';
    ctor.type = 'components.damageComponent';

    var compatibleTypes = ['prop', 'actor'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});