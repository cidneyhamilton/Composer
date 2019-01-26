define(function(require) {

    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.variableScope = attributes.variableScope || 'script';
        this.variableName = attributes.variableName;
        this.operator = attributes.operator || 'eq';
        this.compareTo = attributes.compareTo;
        this.sceneId = attributes.sceneId || null;
        this.propId = attributes.propId || null;
    };

    ctor.prototype.getDescription = function(){
        var that = this;
        var desc = '<span class="variable">' + this.variableName + '</span> is ';

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

        desc += this.compareTo;

        if (this.variableScope == 'global') {
            desc += " on global scope";
        }

        if (this.variableScope == 'script') {
            desc += " on script scope";
        }
        
        if (this.variableScope == 'target') {
            desc += " on target scope";
        }
        
        if (this.variableScope == 'scene') {
            desc += " on scene scope";
        }
        
        if (this.variableScope == 'event') {
            desc += " on event scope";
        }

        if (this.variableScope == 'ego') {
            desc += " on ego scope";
        }

        if (this.variableScope == 'prop') {
            desc += " on prop scope";
        }

        if (this.variableScope == 'prop') {
            if (that.propId == null) {
                desc += " on Undefined";
            } else {
                var results = assetDatabase.props.entries.filter(function(item){
                    return item.id == that.propId;
                });

                desc += " on (" + results[0].name + ")";

                if (that.sceneId == null) {
                    desc += " in Undefined"
                } else {
                    var results = assetDatabase.scenes.entries.filter(function(item){
                        return item.id == that.sceneId;
                    });

                    desc += " in (" + results[0].name + ")";
                }
            }
        }


        return desc;
    };

    ctor.type = 'expressions.variableComparison';
    ctor.displayName = 'Variable Comparison';

    return ctor;
});