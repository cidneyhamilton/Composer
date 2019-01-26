var heroStatusEffects;

define(function(require) {
    if (!heroStatusEffects) {
        heroStatusEffects = require('features/constants/heroStatusEffects');
    }
    
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.EffectType = attributes.EffectType || 0;
        this.Probability = attributes.Probability || 100;
        this.Duration = attributes.Duration || 1;
        this.AdditionalParameter = attributes.AdditionalParameter || 0;
    };

    ctor.displayName = 'Combat Effect Component';
    ctor.type = 'components.combatEffectComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});