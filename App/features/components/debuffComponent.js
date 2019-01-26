var heroStatusEffects;

define(function(require) {
    if (!heroStatusEffects) {
        heroStatusEffects = require('features/constants/heroStatusEffects');
    }

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.EffectType = attributes.EffectType || 0;
        this.Duration = attributes.Duration || 1;
    };

    ctor.displayName = 'Debuff Component';
    ctor.type = 'components.debuffComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});