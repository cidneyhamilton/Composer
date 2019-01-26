// global
var currentPropId;
var currentActorId;
var currentSceneId;

define(function (require) {
    var InteractionMenu = require('./triggers/interact'),
        system = require('durandal/system'),
        serializer = require('plugins/serializer'),
        EntryPoint = require('./entryPoint');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id;
        this.name = attributes.name;

        this.storyEventId = attributes.storyEventId;
        this.sceneId = attributes.sceneId;
        this.propId = attributes.propId;
        this.actorId = attributes.actorId || null;

        this.trigger = attributes.trigger || new InteractionMenu();
        this.entryPoints = attributes.entryPoints || [];

        // Global
        currentPropId = attributes.propId;
        currentActorId = attributes.actorId;
        currentSceneId = attributes.sceneId;
    };

    ctor.type = 'script';

    ctor.New = function (attributes) {
        var json = {
            "id": attributes.id,
            "name": attributes.name,
            "type": ctor.type,
            "actorId": null,
            "trigger": attributes.trigger,
            "entryPoints": [new EntryPoint({ id:system.guid(), name: 'Main' })]
        };

        return serializer.deserialize(serializer.serialize(json));
    };

    ctor.prototype.localize = function(context){
        this.entryPoints.forEach(function(x){ x.localize(context); });
    };

    return ctor;
});