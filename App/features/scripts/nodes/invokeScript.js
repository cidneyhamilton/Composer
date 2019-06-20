define(function(require) {
    var system = require('durandal/system'),
        assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.scriptId = attributes.scriptId || '';
        this.entryPointId = attributes.entryPointId || '';

        this.currentScope = attributes.currentScope || "Current";
        this.currentSceneId = attributes.currentSceneId || null;
        this.currentActorId = attributes.currentActorId || null;
        this.currentStoryEventId = attributes.currentStoryEventId || null;
        this.currentPropId = attributes.currentPropId || null;

    };

    ctor.type = 'nodes.invokeScript';
    ctor.displayName = 'Invoke Script';



    return ctor;
});