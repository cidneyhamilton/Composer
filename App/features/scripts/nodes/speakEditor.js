define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        emotionsMap = require('features/constants/emotions'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        this.actors2 = assetDatabase.actors.entries;

        observable.defineProperty(this, 'actor', function(){
            var that = this;

            var results = that.actors.filter(function(item){
                return item.id == that.node.actorId;
            });

            return results[0] || { name:'???' };
        });

        observable.defineProperty(this, 'actor2', function(){
            var that = this;

            var results = that.actors2.filter(function(item){
                return item.id == that.node.actorId2;
            });
            return results[0] || { name:'' };
        });

        observable.defineProperty(this, 'emotionsMap', function() {
            return emotionsMap;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});