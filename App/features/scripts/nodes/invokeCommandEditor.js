define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var props = assetDatabase.props.entries;

    var ctor = function() {
        NodeEditor.call(this);

        this.scenes = assetDatabase.scenes.entries;
        this.actors = assetDatabase.actors.entries;
        this.scopes = ['script', 'target', 'scene', 'event', 'ego'];

        observable.defineProperty(this, 'props', function(){
            var sceneId = this.node.entityFilterId;
            return props.filter(function(item){
                return item.sceneId == sceneId;
            });
        });

        observable.defineProperty(this, 'entity', function(){
            var that = this, results;

            if (this.node.entityType =='target')
            {
                return { name:"target"};
            }

            if(this.node.entityType == 'actor'){
                results = that.actors.filter(function(item){
                    return item.id == that.node.entityId;
                });
            } else{
                results = that.props.filter(function(item){
                    return item.id == that.node.entityId;
                });
            }

            return results[0] || { name:'???' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});