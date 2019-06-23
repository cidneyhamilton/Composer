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

        var actor = assetDatabase.actors.lookup[that.actorId] || { name:'???' };

        var desc = '<span class="actor">' + actor.name + '</span> is ' + (this.hasNot ? 'NOT' : '' ) + ' present';

        return desc;
    };

    ctor.type = 'expressions.actorPresent';
    ctor.displayName = 'Actor Present';

    return ctor;
});