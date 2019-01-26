define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.scope = attributes.scope || null;
        this.scopeId = attributes.scopeId || null;
        this.scopeFilterId = attributes.scopeFilterId || null;
        this.tags = attributes.tags || null;
        this.has = !!attributes.has;
    };

    ctor.prototype.getDescription = function(){
        var that = this, results, items;

        switch(this.scope){
            case 'actor':
                items = assetDatabase.actors.entries;
                break;
            case 'prop':
                items = assetDatabase.props.entries;
                break;
            case 'scene':
                items = assetDatabase.scenes.entries;
                break;
            case 'storyEvent':
                items = assetDatabase.storyEvents.entries;
                break;
            default:
                items = [];
                break;
        }

        results = items.filter(function(item){
            return item.id == that.scopeId;
        });

if (this.scope == 'target') {
    var entity = { name: this.scope = 'target'};
}
else {
        var entity = results[0] || { name: this.scope == 'script' ? 'script' : '???' };
}



        return '<span class="' + this.scope + '">' + entity.name + '</span>' + ' (' + this.scope +')'
            +  (this.has ? ' is' : ' is not') + ' tagged with "' + this.tags + '"';
    };

    ctor.type = 'expressions.inTags';
    ctor.displayName = 'In Tags';

    return ctor;
});