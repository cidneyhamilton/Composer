define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        this.props = assetDatabase.props.entries;

        this.availableScope = ["relative","absolute","actor","prop"];
        
        observable.defineProperty(this, 'scope', function(){    
            var name = this.node.scope;

            var results = this.availableScope.filter(function(item){
                return item == name;
            });

             return results[0] || '???';
        });


      

        observable.defineProperty(this, 'actor', function(){
            var actorId = this.node.actorId;
            var results = this.actors.filter(function(item){
                return item.id == actorId;
            });

            return results[0] || { name:'???' };
        });

        observable.defineProperty(this, 'availableProps', function() {
            var sceneId = Editor.currentSceneId;
            var results = this.props.filter(function(item){
                return item.sceneId == sceneId;
            });

            return results;
        });


        observable.defineProperty(this, 'availableActors', function() {
            var sceneId = Editor.currentSceneId;
            var results = this.actors;

            return results;
        });


        observable.defineProperty(this, 'spawnPoint', function() {
            if (this.scope == 'prop')
            {
                var spawnId = this.node.propId;
                var results = this.props.filter(function(item){
                    return item.id == spawnId;
                });

                return results[0] || { name:'???' };
            }

             if (this.scope == 'actor')
            {
                var spawnId = this.node.actorId;
                var results = this.actors.filter(function(item){
                    return item.id == spawnId;
                });

                return results[0] || { name:'???' };
            }

            return { name:'Pan' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});