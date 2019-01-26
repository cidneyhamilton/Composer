define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        this.props = assetDatabase.props.entries;

		this.movementTypes = ["Walking","Sneaking","Running","Tightrope", "RopeClimbing", "WalkLerpMotion"];
		
        observable.defineProperty(this, 'actor', function(){
            var actorId = this.node.actorId;
            var results = this.actors.filter(function(item){
                return item.id == actorId;
            });

            return results[0] || { name:'???' };
        });

        observable.defineProperty(this, 'availableProps', function(){
            var sceneId = Editor.currentSceneId;
            var results = this.props.filter(function(item){
                return item.sceneId == sceneId;
            });

            return results;
        });

        observable.defineProperty(this, 'spawnPoint', function(){
            var spawnId = this.node.propId;
            var results = this.props.filter(function(item){
                return item.id == spawnId;
            });

            return results[0] || { name:'???' };
        });
		
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});