define(function(require) {
    var AssetEntry = require('./assetEntry'),
        model = require('plugins/model');

    var ctor = function(index, attributes) {
        AssetEntry.call(this, index, attributes);

        this.storyEventId = attributes.storyEventId;
        this.sceneId = attributes.sceneId;
        this.actorId = attributes.actorId;
        this.propId = attributes.propId;
        this.triggerType = attributes.triggerType;
    };

    model.baseOn(ctor, AssetEntry);

    ctor.prototype.refreshFromItem = function() {
        this.name = this.item.name;
        this.storyEventId = this.item.storyEventId;
        this.sceneId = this.item.sceneId;
        this.actorId = this.item.actorId;
        this.propId = this.item.propId;
        this.triggerType = this.item.trigger.type;
    };

    ctor.prototype.toJSON = function() {
        return {
            id: this.id,
            name: this.name,
            storyEventId: this.storyEventId,
            sceneId: this.sceneId,
            actorId: this.actorId,
            propId: this.propId,
            triggerType: this.triggerType
        };
    };

    return ctor;
});