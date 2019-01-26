define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var props = assetDatabase.props.entries;

    var ctor = function() {
        NodeEditor.call(this);

        this.scenes = assetDatabase.scenes.entries;
        observable.defineProperty(this, 'props', function(){
            
            var sceneId = "a2508b7e-a177-4a96-93bd-4d8ab88dffc4"; //SceneId

            return props.filter(function(item){
                return item.sceneId == sceneId;
            });
        });

        observable.defineProperty(this, 'prop', function(){
            var that = this;

            var results = that.props.filter(function(item){
                return item.id == that.node.propId;
            });

            return results[0] || { name:'???' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});
