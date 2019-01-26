define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId || null;
        this.hasNot =  !!attributes.hasNot;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var results = assetDatabase.actors.entries.filter(function(item){
            return item.id == that.actorId;
        });

        var actor = results[0] || { name:'???' };

        var desc = '<span class="actor">' + actor.name + '</span> is ' + (this.hasNot ? 'NOT' : '' ) + ' present';

        return desc;
    };

    ctor.type = 'expressions.actorPresent';
    ctor.displayName = 'Actor Present';

    return ctor;
});