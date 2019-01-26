define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        ConditionEditor = require('./conditionEditor');

    var ctor = function() {
        this.actors = assetDatabase.actors.entries;
        this.props = assetDatabase.props.entries;
        this.scenes = assetDatabase.scenes.entries;
        this.storyEvents = assetDatabase.storyEvents.entries;
    };

    ConditionEditor.baseOn(ctor);

    ctor.prototype.activate = function(owner, expression){
        ConditionEditor.prototype.activate.call(this, owner, expression);

        observable.defineProperty(this, 'scopedProps', function(){
            var that = this;
            var scopeFilterId = that.expression.scopeFilterId;

            var results = that.props.filter(function(item){
                return item.sceneId == scopeFilterId;
            });

            return results;
        });
    };

    return ctor;
});