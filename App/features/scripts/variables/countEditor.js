define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable');

    var ctor = function () {
    };

    ctor.prototype.activate = function (node, count) {
        this.node = node;
        this.count = count;

        observable.defineProperty(this, 'targets', function () {
            var props = assetDatabase.props.entries;
            var results = [{ name:'Money', id:'money' }];
            return results.concat(props);
        });

        observable.defineProperty(this, 'description', function () {
            // If count is defined, return a user-friendly description for it.
            if (this.count) {
                return this.count.getDescription();
            }
            return null;
        });
    }

    return ctor;
});