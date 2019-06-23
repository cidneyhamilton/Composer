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
                var prop = assetDatabase.props.lookup[this.propId];

                desc += " on (" + (prop ? prop.name : this.propId) + ")";

                if (this.sceneId == null) {
                    desc += " in Undefined"
                } else {
                    var scene = assetDatabase.scenes.lookup[this.sceneId];

                    desc += " in (" + (scene ? scene.name : this.sceneId) + ")";
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