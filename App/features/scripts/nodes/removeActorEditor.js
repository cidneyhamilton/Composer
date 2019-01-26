define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;

		// Actor we are using
        observable.defineProperty(this, 'actor', function(){
            var actorId = this.node.actorId;
            var results = this.actors.filter(function(item){
                return item.id == actorId;
            });

            return results[0] || { name:'???' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});