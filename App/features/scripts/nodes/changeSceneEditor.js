define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var ctor = function() {
        NodeEditor.call(this);

        this.scenes = assetDatabase.scenes.entries;
        this.props = assetDatabase.props.entries;

        observable.defineProperty(this, 'scene', function(){
            var sceneId = this.node.sceneId;
            var results = this.scenes.filter(function(item){
                return item.id == sceneId;
            });

            return results[0] || { name:'???' };
        });

        observable.defineProperty(this, 'availableProps', function(){
            var sceneId = this.node.sceneId;
            var results = this.props.filter(function(item){
                return item.sceneId == sceneId;
            });

            return results;
        });

        observable.defineProperty(this, 'spawnPoint', function(){
            var spawnId = this.node.spawnId;
            var results = this.props.filter(function(item){
                return item.id == spawnId;
            });

            return results[0] || { name:'???' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});