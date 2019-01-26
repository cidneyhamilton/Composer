define(function (require) {
    var observable = require('plugins/observable');
    var assetDatabase = require('infrastructure/assetDatabase');
    var ctor = function () {
    };

    ctor.prototype.activate = function (node, killCount) {
        this.node = node;
        this.actors = assetDatabase.actors.entries;
        this.killCount = killCount;
        observable.defineProperty(this, 'actors', function () {
            var actorId = node.actorId;
            return assetDatabase.actors.entries.filter(function (item) {
                return item.actorId == actorId;
            });
        });

        observable.defineProperty(this, 'description', function () {
            // If skillValueName is defined, return a user-friendly description for it.
            if (this.killCount) {
                return "Kill Count: " + this.killCount.getDescription();
            }
            return null;
        });
    }

    return ctor;
});