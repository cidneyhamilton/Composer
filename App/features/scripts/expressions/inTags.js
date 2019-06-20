define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        selectedGame = require('features/projectSelector/index');

    // Courtesy of https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
    // First, checks if it isn't implemented yet.
    if (!String.prototype.format) {
      String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
    }

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
        } else {
            var entity = results[0] || { name: this.scope == 'script' ? 'script' : '???' };
        }

        var result = "";

        if (selectedGame.showAdvanced) {
            result = "<span class='{0}'>{1}</span> ({0}) {2} tagged with '{3}'".format(this.scope, entity.name, this.has ? ' is' : ' is not', this.tags);
        } else {
            result = "{0} tagged with '{1}'".format(this.has ? ' is' : ' is not', this.tags);
        }
        return result;
        
    };

    ctor.type = 'expressions.inTags';
    ctor.displayName = 'In Tags';

    return ctor;
});