define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.sceneId = attributes.sceneId || null;
        this.scope = attributes.scope || 'DuringCurrentEvent';
        this.operator = attributes.operator || 'eq';
        this.count = attributes.count || 0;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var results = assetDatabase.scenes.entries.filter(function(item){
            return item.id == that.sceneId;
        });

        var scene = results[0] || { name:'???' };

        var desc = 'has entered <span class="scene">' + scene.name + '</span> ';

        if(this.scope == 'DuringCurrentEvent'){
            desc += 'during the current event ';
        }else{
            desc += 'during the game '
        }

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

        desc += this.count.toString();

        if(this.count != 1){
            desc += " times";
        }else{
            desc += " time";
        }

        return desc;
    };

    ctor.type = 'expressions.enteredScene';
    ctor.displayName = 'Entered Scene';

    return ctor;
});