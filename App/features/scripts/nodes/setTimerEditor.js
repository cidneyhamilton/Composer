define(function (require) {
    var NodeEditor = require('./nodeEditor'),
        assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable');

    var props = assetDatabase.props.entries;

    var ctor = function () {
        NodeEditor.call(this);

        this.scopes = ['ego', 'event', 'scene', 'prop'];
        this.scenes = assetDatabase.scenes.entries;

        observable.defineProperty(this, 'props', function () {
            var sceneId = this.node.sceneId;
            return props.filter(function (item) {
                return item.sceneId == sceneId;
            });
        });

        this.scripts = assetDatabase.scripts.entries.filter(function(entry) {
            return entry.triggerType == 'triggers.manual';
        });

        observable.defineProperty(this, 'script', function(){
            var that = this;
            var results = that.scripts.filter(function(item){
                return item.id == that.node.scriptId;
            });

            return results[0] || { name:'???' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});