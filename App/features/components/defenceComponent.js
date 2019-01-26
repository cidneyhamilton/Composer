define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.DamageSourceType = attributes.DamageSourceType || '0';
        this.Value = attributes.Value || 0;
        this.IsPercentage = attributes.IsPercentage || true;

        this.DamageSourceType2 = attributes.DamageSourceType2 || '0';
        this.Value2 = attributes.Value2 || 0;
        this.IsPercentage2 = attributes.IsPercentage2 || true;

    };

    ctor.displayName = 'DefenseComponent';
    ctor.type = 'components.defenseComponent';

    var compatibleTypes = ['prop', 'actor'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});