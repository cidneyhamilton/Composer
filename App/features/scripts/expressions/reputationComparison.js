define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.actorId = attributes.actorId;
        this.operator = attributes.operator || 'eq';
        this.value = attributes.value;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var results = assetDatabase.actors.entries.filter(function(item){
            return item.id == that.actorId;
        });

        var actor = results[0] || { name:'???' };

        var desc = 'reputation with <span class="actor">' + actor.name + '</span> is ';

        switch(this.operator){
            case 'eq':
                break;
            case 'gt':
                desc += "greater than ";
                break;
            case 'gte':
                desc += "greater than or equal to ";
                break;
            case 'lt':
                desc += "less than ";
                break;
            case 'lte':
                desc += "less than or equal to ";
                break;
            case 'ne':
                desc += "not ";
                break;
        }

        desc += this.value;

        return desc;
    };

    ctor.type = 'expressions.reputationComparison';
    ctor.displayName = 'Reputation Comparison';

    return ctor;
});