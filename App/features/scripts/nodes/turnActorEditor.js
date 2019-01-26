define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        this.props = assetDatabase.props.entries;

        // Actor we are using
        observable.defineProperty(this, 'actor', function(){
            var actorId = this.node.actorId;
            var results = this.actors.filter(function(item){
                return item.id == actorId;
            });

            return results[0] || { name:'???' };
        });

        // scope we are using
        this.availableScope = ["prop","actor"];        
        observable.defineProperty(this, 'scope', function(){    
            var name = this.node.scope;

            var results = this.availableScope.filter(function(item){
                return item == name;
            });

             return results[0] || '???';
        });

        // Actor we are looking at
        observable.defineProperty(this, 'availableActors', function(){
            return this.actors;
        });

        observable.defineProperty(this, 'turnToObject', function(){
            
            if (this.scope == "prop")
            {
                var spawnId = this.node.propId;
                var result = this.props.filter(function(item){
                    return item.id == spawnId;
                });
                return result[0] || {name:'???'};
            }

            if (this.scope == "actor")
            {
                var spawnId = this.node.targetActorId;
                var result = this.actors.filter(function(item){
                    return item.id == spawnId;
                });
                return result[0] || {name:'???'};
            }
        });


        observable.defineProperty(this, 'secondActor', function(){
            var spawnId = this.node.actorId2;
            var results = this.actors.filter(function(item){
                return item.id == spawnId;
            });

            return results[0] || { name:'???' };
        });

        // Prop we are looking at
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