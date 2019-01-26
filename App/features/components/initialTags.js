define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.tags = attributes.tags || '';
    };

    ctor.displayName = 'Initial Tags';
    ctor.type = 'components.initialTags';

    var compatibleTypes = ['scene','actor','storyEvent','prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});