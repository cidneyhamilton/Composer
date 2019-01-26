define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        this.props = assetDatabase.props.entries;

        this.availableBehaviours = ["Idle","Sitting","SittingDesk","Kneeling","Ghost","TerkPatrol","CatPatrol","Injured","Reading","ReadingLookUp", "IdleOffMesh", "ThrowKnifeLoop", "FellDown", "ComposerCombat", "RopeClimbing"];

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
            var spawnId = this.node.spawnId;
            var results = this.props.filter(function(item){
                return item.id == spawnId;
            });

            return results[0] || { name:'Current' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});