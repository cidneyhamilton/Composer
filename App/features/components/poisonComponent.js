define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.PoisonChance = attributes.PoisonChance || 0;

        this.MinValue = attributes.MinValue || 1;
        this.MaxValue = attributes.MaxValue || 1;
    };

    ctor.displayName = 'PoisonComponent';
    ctor.type = 'components.poisonComponent';

    var compatibleTypes = ['actor'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});