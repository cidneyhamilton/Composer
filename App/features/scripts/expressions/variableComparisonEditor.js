define(function(require) {
    var ConditionEditor = require('./conditionEditor');
    var assetDatabase = require('infrastructure/assetDatabase');
    var observable = require('plugins/observable'),
        selectedGame = require('features/projectSelector/index');

    var scopes;
    if (selectedGame.showAdvanced) {
        scopes = ['global', 'script', 'target', 'scene', 'event', 'ego', 'prop'];
    } else {
        scopes = ['ego'];
    }

    var ctor = function() {
        this.scopes = scopes;
        this.props = assetDatabase.props.entries;
        this.scenes = assetDatabase.scenes.entries;
    };

    ConditionEditor.baseOn(ctor);


    ctor.prototype.activate = function(owner, expression){
        ConditionEditor.prototype.activate.call(this, owner, expression);

        
        observable.defineProperty(this, 'scopedProps', function(){
            var that = this;
            var scopeFilterId = that.expression.sceneId;

            var results = that.props.filter(function(item){
                return item.sceneId == scopeFilterId;
            });

            return results;
        });
    };

    return ctor;
});
