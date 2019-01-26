var requiredTargets;

define(function(require) {
    
    requiredTargets = [
        { id:'0', name: 'Any'},
        { id:'1', name: 'Undead'}
    ];

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.TargetType = attributes.TargetType || 0;
    };

    ctor.displayName = 'Requires Target Component';
    ctor.type = 'components.requiresTargetComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});