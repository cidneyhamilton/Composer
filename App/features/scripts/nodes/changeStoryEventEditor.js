define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var ctor = function() {
        NodeEditor.call(this);

        this.storyEvents = assetDatabase.storyEvents.entries;

        observable.defineProperty(this, 'storyEvent', function(){
            var storyEventId = this.node.storyEventId;
            var results = this.storyEvents.filter(function(item){
                return item.id == storyEventId;
            });

            return results[0] || { name:'???' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});