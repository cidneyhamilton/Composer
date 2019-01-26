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

        // TODO Investigate trigger.futurescript type
        this.scripts = assetDatabase.scripts.entries.filter(function(entry) {
            return entry.triggerType == 'triggers.manual';
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});