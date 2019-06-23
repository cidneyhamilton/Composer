define(function(require) {

    var assetDatabase = require('infrastructure/assetDatabase'),
        selectedGame = require('features/projectSelector/index');

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

    // Get descriptive text for the scope of the variable. Used in the advanced view.
    ctor.prototype.getScopeDescription = function() {
        var desc;
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
            if (this.propId == null) {
                desc += " on Undefined";
            } else {
                var results = assetDatabase.props.entries.filter(function(item){
                    return item.id == this.propId;
                });

                desc += " on (" + (results[0] ? results[0].name : this.propId) + ")";

                if (this.sceneId == null) {
                    desc += " in Undefined"
                } else {
                    var results = assetDatabase.scenes.entries.filter(function(item){
                        return item.id == this.sceneId;
                    });

                    desc += " in (" + (results[0] ? results[0].name : this.sceneId) + ")";
                }
            }
        }

        return desc;
    }

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

        if (this.compareTo) {
           desc += this.compareTo;
        }

        if (selectedGame.showAdvanced) {
          desc += this.getScopeDescription();
        }

        return desc;
    };

    ctor.type = 'expressions.variableComparison';
    ctor.displayName = 'Variable Comparison';

    return ctor;
});