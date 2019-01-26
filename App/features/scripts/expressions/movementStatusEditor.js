define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        ConditionEditor = require('./conditionEditor'),
        observable = require('plugins/observable');

    var props = assetDatabase.props.entries;

    var ctor = function() {
        this.scenes = assetDatabase.scenes.entries;
/*
        observable.defineProperty(this, 'props', function(){
            var sceneId = this.expression.sceneId;
            return props.filter(function(item){
                return item.sceneId == sceneId;
            });
        });
*/
        observable.defineProperty(this, 'statuses', function() {
            return ['Walking', 'Sneaking', 'Running'];
        });
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});
