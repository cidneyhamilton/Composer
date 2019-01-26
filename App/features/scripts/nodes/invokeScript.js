define(function(require) {
    var system = require('durandal/system');
    var assetDatabase = require('infrastructure/assetDatabase');

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

        // Check for legacy Invoke Script nodes and patch the data
        /*
        if (attributes.currentSceneId == null &&
            attributes.currentActorId == null &&
            attributes.currentStoryEventId == null &&
            attributes.scriptId != '') {
           // && attributes.entryPointId == "") {

            var results = assetDatabase.scripts.entries.filter(function(item){
                return item.id == attributes.scriptId ;
            });
            var script = results[0];
            if (script) {
                if (script.sceneId) {
                    this.currentScope = "Scenes";
                    this.currentSceneId = script.sceneId;
                } else if (script.actorId) {
                    this.currentScope = "Actors";
                    this.currentActorId = script.actorId;
                } else if (script.storyEventId) {
                    this.currentScope = "StoryEvents";
                    this.currentStoryEventId = script.storyEventId;
                }
            }
        }
        */
    };

    ctor.type = 'nodes.invokeScript';
    ctor.displayName = 'Invoke Script';



    return ctor;
});