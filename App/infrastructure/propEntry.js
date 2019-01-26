define(function(require) {
    var AssetEntry = require('./assetEntry'),
        model = require('plugins/model');

    var ctor = function(index, attributes) {
        AssetEntry.call(this, index, attributes);

        this.sceneId = attributes.sceneId;
        this.value = attributes.value;
    };

    model.baseOn(ctor, AssetEntry);

    ctor.prototype.refreshFromItem = function() {
        this.name = this.item.name;
        this.sceneId = this.item.sceneId;
        this.value = this.item.value;
    };

    ctor.prototype.toJSON = function() {
        return {
            id: this.id,
            name: this.name,
            sceneId: this.sceneId,
            value: this.value
        };
    };

    return ctor;
});