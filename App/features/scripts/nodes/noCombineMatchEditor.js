define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var ctor = function () {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;

        observable.defineProperty(this, 'actor', function () {
            var that = this;

            var results = that.actors.filter(function (item) {
                return item.id == that.node.actorId;
            });

            return results[0] || { name: '???' };
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});