define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.PrefabReference = attributes.PrefabReference || 0;
    };

    ctor.displayName = 'PrefabReference';
    ctor.type = 'components.prefabReferenceComponent';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});