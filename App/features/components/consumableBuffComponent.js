var skillOrStatMap;

define(function(require) {
    if (!skillOrStatMap) {
        var loadedConstants = require('features/constants/loadedConstants');
        skillOrStatMap = loadedConstants.constants.SkillsAndStats;
    }
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.BuffTargetType = attributes.BuffTargetType || 0;
        this.Value = attributes.Value || 0;
        this.Duration = attributes.Duration || -1; // In minutes
        this.IsPercentage = attributes.IsPercentage || false;
    };

    ctor.displayName = 'ConsumableBuffComponent';
    ctor.type = 'components.grantBuffComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});