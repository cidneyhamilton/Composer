var skillOrStatMap;

define(function(require) {
    if (!skillOrStatMap) {
        skillOrStatMap = require('features/constants/skillsAndAttributes');
    }
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.BuffA = attributes.BuffA || new function()
            {
                this.Target = attributes.Target || 0;
                this.Value = attributes.Value || 0;
            };


        this.BuffB = attributes.BuffB || new function()
            {
                this.Target = attributes.Target || 0;
                this.Value = attributes.Value || 0;
            };


        this.BuffC = attributes.BuffC || new function()
            {
                this.Target = attributes.Target || 0;
                this.Value = attributes.Value || 0;
            };

    };

    ctor.displayName = 'EquipableBuffComponent';
    ctor.type = 'components.equipableBuffComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});