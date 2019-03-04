define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system'),
        db = require('infrastructure/assetDatabase'),
        inventoryPicklists = require('features/constants/inventoryPicklists'),
        ProofreadWriter = require('infrastructure/proofreadWriter'),
        ProofreadSimpleWriter = require('infrastructure/proofreadSimpleWriter'),
        commaDelimiter = /\s*,\s*/,
        idMap = {},    // Map of [GUID, <Name of [Actor | Prop | Scene | Script | StoryEvent]> ]
        minigamesMap = require('features/constants/minigames'),
        emotionsMap = require('features/constants/emotions'),
        heroStatusEffects = require('features/constants/heroStatusEffects'),
        skillOrStatMap = require('features/constants/skillsAndAttributes'),
        damageSourceTypes = require('features/constants/damageSourceTypes'),

        activeThreadCounter = 0;      // Used to ensure all async threads are done processing


    // Given an ID and the type of Id, return the human-readable value (ex: ActorName for an Actor ID)
    function getDisplayValue(sceneName, scriptData, type, typeId) {
        var displayValue;
        switch(type){
            case 'actor':
            case 'prop':
            case 'scene':
            case 'script':
            case 'storyEvent':
                displayValue = idMap[typeId];
                break;
            case 'target':
                displayValue = type;
                break;
            default:
                displayValue = type;
                break;
        }
        return displayValue;
    }

    // Process a "Section" in the script for display
    function processSection(sceneName, scriptData, allEntryPoints, parentNode, section, singleSection) {
        var scriptName = scriptData.name;
        singleSection["type"] = section.type;
        if (section.text) {
            singleSection.text = section.text;
        }
        if (section.expression) {
            singleSection.expression = section.expression.getDescription();
        }
        if (section.nodes && section.nodes.length > 0) {
            var nodes = [];
            singleSection.nodes = nodes;
            processNodeArray(sceneName, scriptData, allEntryPoints, section.nodes, singleSection.nodes);
        }
    }

    // Process an array of Sections in the script
    function processSectionArray(sceneName, scriptData, allEntryPoints, parentNode, sectionArr, sectionData) {
        for (var i = 0; i < sectionArr.length; i++) {
            var singleSection = {};
            processSection(sceneName, scriptData, allEntryPoints, parentNode, sectionArr[i], singleSection);
            sectionData.push(singleSection);
        }
    }

    function populateDefaults(original, copy) {
        Object.getOwnPropertyNames(original).forEach(function(propertyName) {
            // skip any system properties
            if (propertyName.indexOf("__") != -1) {
                return;
            }

            copy[propertyName] = original[propertyName];
        });
    }

    // Process a single node in the script
    function processSingleNode(sceneName, scriptData, allEntryPoints, node, nodeData) {

        populateDefaults(node, nodeData);

        nodeData.desc = node.__proto__.constructor.displayName;
        var scriptName = scriptData.name;

        if(node.scopeId) {
            nodeData.scope = getDisplayValue(sceneName, scriptData, node.scope, node.scopeId);
        } 
        if (node.actorId) {
            nodeData.actor = getDisplayValue(sceneName, scriptData, 'actor', node.actorId);
        }
        if (node.actorId2) {
            nodeData.actor2 = getDisplayValue(sceneName, scriptData, 'actor', node.actorId2);
        }
        if (node.targetActorId) {
            nodeData.targetActor = getDisplayValue(sceneName, scriptData, 'actor', node.targetActorId);
        }
        if (node.emotion) {
            nodeData.emotion = emotionsMap.getEmotionById(node.emotion);
        }
        if (node.emotion2) {
            nodeData.emotion2 = emotionsMap.getEmotionById(node.emotion2);
        }
        if (node.device) {
            if (node.device == '0') {
                delete nodeData.device;
            } else {
                nodeData.device = emotionsMap.getDeviceById(node.device);
            }
        }
        if (node.device2) {
            if (node.device2 == '0') {
                delete nodeData.device2;
            } else {
                nodeData.device2 = emotionsMap.getDeviceById(node.device2);
            }
        }
        if (node.propId) {
            nodeData.prop = getDisplayValue(sceneName, scriptData, 'prop', node.propId);
        }
        if (node.success) {
            var success = {};
            processSection(sceneName, scriptData, allEntryPoints, nodeData, node.success, success);
            nodeData.success = success;
        }
        if (node.failure) {
            var failure = {};
            processSection(sceneName, scriptData, allEntryPoints, nodeData, node.failure, failure);
            nodeData.failure = failure;
        }
        if (node.change) {
            nodeData.change = ('0' == node.change ? "Remove" : "Add");
        }
        if (node.currency) {
            nodeData.currency = ('1' == node.currency ? "Deeds" : '2' == node.currency ? "Demerits" : "Lyra (money)");
        }
        if (node.startGameScript) { nodeData.startGameScript = getDisplayValue(sceneName, scriptName, "script", node.startGameScript); }
        if (node.endRoundScript) { nodeData.endRoundScript = getDisplayValue(sceneName, scriptName, "script", node.endRoundScript); }
        if (node.endGameScript) { nodeData.endGameScript = getDisplayValue(sceneName, scriptName, "script", node.endGameScript); }
        if (node.playerKey1) { nodeData.playerKey1 = minigamesMap.getPoobahPlayerById(node.playerKey1); }
        if (node.playerKey2) { nodeData.playerKey2 = minigamesMap.getPoobahPlayerById(node.playerKey2); }
        if (node.playerKey3) { nodeData.playerKey3 = minigamesMap.getPoobahPlayerById(node.playerKey3); }
        if (node.playerKey4) { nodeData.playerKey4 = minigamesMap.getPoobahPlayerById(node.playerKey4); }
        if (node.playerKey5) { nodeData.playerKey5 = minigamesMap.getPoobahPlayerById(node.playerKey5); }
        if (node.playerKey6) { nodeData.playerKey6 = minigamesMap.getPoobahPlayerById(node.playerKey6); }
        if (node.entityType) {
            nodeData.entity = getDisplayValue(sceneName, scriptData, node.entityType, node.entityId);
        }
        if (node.sceneId) {
            nodeData.scene = getDisplayValue(sceneName, scriptData, "scene", node.sceneId);
        }
        if (node.scriptId) {
            nodeData.script = getDisplayValue(sceneName, scriptData, "script", node.scriptId);
        }
        if (node.currentScope && node.currentScope == 'Current') {
            nodeData.entryPoint = allEntryPoints[node.entryPointId] ? allEntryPoints[node.entryPointId] : 'Unknown Entry Point ID: ' + node.entryPointId;
        }
        if (node.spawnId) {
            nodeData.spawn = getDisplayValue(sceneName, scriptData, "prop", node.spawnId);
        }
        if (node.storyEventId) {
            nodeData.storyEvent = getDisplayValue(sceneName, scriptData, 'storyEvent', node.storyEventId);
        }
        if (node.itemTypeFilter) {
            nodeData.itemTypeFilter = inventoryPicklists.getItemTypeById(node.itemTypeFilter);
        }
        if (node.minigameIndex) {
            nodeData.minigame = minigamesMap.getMinigameById(node.minigameIndex);
        }
        if (node.musicTrack) {
            var nodeChannel = (node.channel == 1 ? 'main' : 'ambient');
            var loopType = (node.loopType == 1 ? 'play once' : 'repeat at interval');
            nodeData.musicTrack = node.musicTrack + '(' + nodeChannel + ') (' + loopType + ')';
        }
        if (node.Unique && null != node.Unique) {
            nodeData.Unique = node.Unique;
        }
        if (node.source) {
            nodeData.source = node.source.getDescription();
        }

        if (node.nodes) {
            var nodes = [];
            nodeData.nodes = nodes;
            processNodeArray(sceneName, scriptData, allEntryPoints, node.nodes, nodeData.nodes);
        }

        if (node.sections && node.sections.length > 0) {
            var sections = [];
            nodeData.sections = sections;

            processSectionArray(sceneName, scriptData, allEntryPoints, nodeData, node.sections, nodeData.sections);
        }

        if (node.options && node.options.length > 0) {
            var sections = [];
            nodeData.sections = sections;

            processSectionArray(sceneName, scriptData, allEntryPoints, nodeData, node.options, nodeData.sections);
        }
    }

    // Process an array of nodes in the script
    function processNodeArray(sceneName, scriptData, allEntryPoints, nodeArr, nodeData) {
        for(var i = 0; i < nodeArr.length; i++) {
            var singleNode = {};
            processSingleNode(sceneName, scriptData, allEntryPoints, nodeArr[i], singleNode);
            nodeData.push(singleNode);
        }
    }

    // Process a single entry point in the script
    function processEntryPoint(sceneName, scriptData, allEntryPoints, entryPoint, entryPointData) {
        entryPointData["name"] = entryPoint.name;

        if (entryPoint.nodes && entryPoint.nodes.length > 0) {
            var nodes = [];
            entryPointData["nodes"] = nodes;
            processNodeArray(sceneName, scriptData, allEntryPoints, entryPoint.nodes, entryPointData["nodes"]);
        }
    }

    // Process a single script
    function processScript(sceneName, script, scriptData){
        script.open();
        scriptData["id"] = script.id;
        scriptData["name"] = script.item.name;
        if (script.propId) {
            scriptData["prop"] = getDisplayValue(sceneName, scriptData, 'prop', script.propId);
        }
        if (script.actorId) {
            scriptData["actor"] = getDisplayValue(sceneName, scriptData, 'actor', script.actorId);
        }
        if (script.storyEventId) {
            scriptData["storyEvent"] = getDisplayValue(sceneName, scriptData, "storyEvent", script.storyEventId);
        }
        if (script.triggerType) {
            scriptData["trigger"] = script.item.trigger.name;
        }
        if (script.item.entryPoints) {
            var entryPoints = [];
            scriptData["entryPoints"] = entryPoints;

            var length = script.item.entryPoints.length;
            if (length) {
                var entryPointMap = {};
                for (var epCounter = 0; epCounter < length; epCounter ++) {
                    entryPointMap[script.item.entryPoints[epCounter].id] = script.item.entryPoints[epCounter].name;
                }
                for (var epCounter = 0; epCounter < length; epCounter ++) {
                    var entryPoint = {};
                    processEntryPoint(sceneName, scriptData, entryPointMap, script.item.entryPoints[epCounter], entryPoint);
                    entryPoints.push(entryPoint);
                }
            }
        }
        activeThreadCounter--;
        script.close();
    }

    function processSceneInternal(sceneId, sceneName, scriptTable) {
            // Find all scripts associated with this scene.
            var scriptsSelected = [];
            for (var scriptCounter = 0; scriptCounter < db.scripts.entries.length ; scriptCounter++) {
                var currScript = db.scripts.entries[scriptCounter];
                // If this script is part of this scene, then add it to our array.
                var currScriptSceneId = currScript['sceneId'];
                var currPropId = currScript['propId'];
                var currActorId = currScript['actorId'];
                if ((currScriptSceneId === sceneId) || (null == sceneId && (!currScriptSceneId || null == currScriptSceneId)))  {
                    var scriptData = {};
                    activeThreadCounter++;
                    // If we're on a scene that is hanging off a prop or a script, use that name instead of the scene name
                    if (null == sceneId) {
                        if (null != currPropId) {
                            sceneName = '[Prop : ' + getDisplayValue(sceneName, scriptData, 'prop', currPropId) + ' ]';
                        } else if (null != currActorId) {
                            sceneName = '[Actor: ' + getDisplayValue(sceneName, scriptData, 'actor', currActorId) + ' ]';
                        }
                    }
                    processScript(sceneName, currScript, scriptData);
                    scriptsSelected.push(scriptData);
                }
            }

            // Only flag for script file-write if there are scripts in the scene
            if(scriptsSelected.length > 0) {
                scriptTable[sceneName] = scriptsSelected;
            }

            activeThreadCounter--;
    }

    // Processes a single scene
    function processScene(scene, scriptTable) {
        scene.open();
        processSceneInternal(scene.id, scene.name, scriptTable);
        scene.close();
    }

    return {
        run:function(context) {
            context.indicator.message = 'Creating internal documentation...';

            return system.defer(function(dfd){
                var sceneCounter = 0;
                var numScenes = db.scenes.entries.length;
                var currentScene;
                var scriptTable = {};

                // We'll need actors, props, and storyEvents across all maps - populate these first
                function populateData() {
                    miniPopulate('actor', idMap, db.actors.entries);
                    miniPopulate('prop', idMap, db.props.entries);
                    miniPopulate('scene', idMap, db.scenes.entries);
                    miniPopulate('script', idMap, db.scripts.entries);
                    miniPopulate('storyEvent', idMap, db.storyEvents.entries);
                }

                function miniPopulate(dataType, mapToPopulate, sourceMap) {
                    for (var i = 0; i < sourceMap.length ; i++) {
                        mapToPopulate[sourceMap[i].id] = sourceMap[i].name;
                    }
                }

                // Process the next available scene in the system
                function nextScene(){
                    if(sceneCounter < numScenes){
                        currentScene = db.scenes.entries[sceneCounter];
                        activeThreadCounter++;
                        processScene(currentScene, scriptTable);
                        sceneCounter++;
                        nextScene();
                    } else if (sceneCounter == numScenes) {
                        // Create a mock-scene for all existing sceneless-scripts
                        var sceneName = "(No Scene)"
                        activeThreadCounter++;
                        processSceneInternal(null, sceneName, scriptTable);
                        sceneCounter++;
                        nextScene();
                    } else if (activeThreadCounter > 0) {
                        twiddleThumbs();
                    } else {
                        writeInternalDocs();
                    }
                }

                // Can't you feel the love for JS' lack of good async processing?
                function twiddleThumbs() {
                    // Stay a while and listen! Then try again.
                    // Put this in a separate call so we can talk back and forth
                    // instead of recursively.
                    setTimeout(nextScene, 50);
                }

                function writeProofreadFile(writer, table) {
                    writer.writeHtmlHeader();
                    for(var key in table){
                        writer.writeData(key, table[key]);
                    }
                    writer.writeHtmlFooter();
                    writer.end();
                }

                // Actually do the write to file.
                function writeInternalDocs() {
                    // Copy any css over
                    fileSystem.copyDirectory(path.resolve(process.cwd(), "App/features/build/internalDoc"), context.internalDocOutputDirectory);

                    var gameTextFileName = path.join(context.internalDocOutputDirectory, 'game_text.html');
                    writeProofreadFile(ProofreadWriter.createFileWriter(gameTextFileName), scriptTable);

                    context.completed.push('features/build/data/internalDoc');
                    dfd.resolve();
                }
                populateData();
                nextScene();
            }).promise();
        }
    };
});