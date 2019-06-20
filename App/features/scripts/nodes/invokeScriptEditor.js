define(function(require) {
    var NodeEditor = require('./nodeEditor'),
        ScriptEditor = require('features/scripts/editor'),
        assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        selectedGame = require('features/projectSelector/index');

    var ctor = function () {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        this.scenes = assetDatabase.scenes.entries;
        this.storyEvents = assetDatabase.storyEvents.entries;
        this.props = assetDatabase.props.entries;
        
        this.availableScope = ["Current", "Scenes"];
        if (selectedGame.showAdvanced) {
            this.availableScope.concat(["Actors","Props","StoryEvents"]);
        }

        observable.defineProperty(this, 'scope', function(){    
            var name = this.node.currentScope;

            var results = this.availableScope.filter(function(item){
                return item == name;
            });

             return results[0] || '???';
        });

        observable.defineProperty(this, 'available', function() {

            var result = [];
            switch (this.node.currentScope) {
                case "Current":
                    result = ScriptEditor.currentScript.entryPoints;
                    break;
                case "Actors":
                    result = this.actors;
                    break;
                case "Scenes":
                    result = this.scenes;
                    break;
                case "StoryEvents":
                    result = this.storyEvents;
                    break;
                case "Props":
                    //console.log("Locating Props");
                    // List of manual scripts that have a prop entry
                    var scripts = assetDatabase.scripts.entries.filter(function(entry){
                                return entry.triggerType == 'triggers.manual' && entry.propId != null;
                            });

                    // Create unique list (note: Not the fastest implementation)
                    var map = scripts.map(function(obj) { return obj.propId; });
                    var uniqueMap = map.filter(function(v, i) { return map.indexOf(v) == i; });
                     
                    for (i = 0; i < uniqueMap.length; i++) {
                        var propId = uniqueMap[i];
                        var value = this.props.filter(function(item){
                            return item.id == propId;
                        });
                        if (value[0]) {
                            result.push(value[0]);
                        }
                    }
                    console.log(result);

                    break;
                default:
                    return { name: "Unrecognized scope: " + this.node.currentScope };
            }
            return result;
        });

        observable.defineProperty(this, 'script', function(){
            var that = this;
            var results = that.scripts.filter(function(item){
                return item.id == that.node.scriptId;
            });

            return results[0] || [{ name: '???' }] ;
        });

        observable.defineProperty(this, 'scripts', function(){

            var currentScope = this.node.currentScope;
            var currentSceneId = this.node.currentSceneId;
            var currentActorId = this.node.currentActorId;
            var currentStoryEventId = this.node.currentStoryEventId;
            var currentPropId = this.node.currentPropId;
            var currentScriptId = this.node.scriptId;
            var currentEntryPointId = this.node.entryPointId;

            //console.log("Finding script for scope" + currentScope);

            if (currentScope == "Actors") {
                if (currentActorId) {
                    var results = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.triggerType == 'triggers.manual' && entry.actorId == currentActorId;
                    });
                    return results;
                } else {
                    return [];
                }
            }

            if (currentScope == "Scenes") {
                if (currentSceneId) {
                    var results = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.triggerType == 'triggers.manual' && entry.sceneId == currentSceneId;
                    });
                    return results;
                } else {
                    return [];
                }
            }

            if (currentScope == "StoryEvents") {
                if (currentStoryEventId) {
                    var results = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.triggerType == 'triggers.manual' && entry.storyEventId == currentStoryEventId;
                    });
                    return results;
                } else {
                    return [];
                }
            }

            if (currentScope == "Props") {
                if (currentPropId) {
                    var results = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.triggerType == 'triggers.manual'  && entry.propId == currentPropId;
                    });
                    return results;
                } else {
                    return [];
                }
            }

            // Must be current script
            // Look for the entrypoint
            var entrypoint = "???";
            for(var i=0;i<ScriptEditor.currentScript.entryPoints.length;i++) {
                if (ScriptEditor.currentScript.entryPoints[i].id == currentEntryPointId) {
                    entrypoint = ScriptEditor.currentScript.entryPoints[i].name;
                }
            }
            
            return [{ name:'Current: ' + entrypoint, id:currentScriptId }];
        });

        observable.defineProperty(this, 'entryPoints', function () {

            if (this.node.currentScope == "Current") {
                    this.node.scriptId = ScriptEditor.currentScript.id;
                    return ScriptEditor.currentScript.entryPoints;
            } else {
                this.node.entryPointId = '';
            }

            return [];
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});