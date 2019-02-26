define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system'),
        db = require('infrastructure/assetDatabase'),

        // Processors
        tagUsageReportProcessor = require('features/build/data/processors/tagUsageReportProcessor');



    return {
        run: function(context, localizationDupes) {
            context.indicator.message = 'Generating additional output...';

            return system.defer(function(dfd){

                var badIds = []; 
                var idMap = {
                    flagInvalidGuid: function(script, type, typeId) {
                        badIds.push({
                            scriptId: script.id,
                            sceneId: script.sceneId,
                            typeId: typeId,
                            type: type
                        });
                    },
                    getDisplayValue: function(script, type, typeId) {
                        var displayValue;
                        switch(type){
                            case 'actor':
                            case 'prop':
                            case 'scene':
                            case 'script':
                            case 'storyEvent':
                            case 'entryPoint':
                                if (typeId && null != typeId && !idMap[typeId]) {
                                    flagInvalidGuid(script, type, typeId);
                                }
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

                };    // Map of [GUID, <Name of [Actor | Prop | Scene | Script | StoryEvent]> ]
                var allProcessors = [tagUsageReportProcessor];

                function generate() {

                    // Populate the idMap
                    populateIdMap();

                    // Iterate over each script
                    processScripts();
                
                    for(var i = 0; i < allProcessors.length; i++) {
                        allProcessors[i].finish(context);
                    } 
                    
                    context.completed.push('features/build/data/generateAddlOutput');
                    dfd.resolve();
                }

                function populateIdMap() {
                    initializeIdMap('actor', db.actors.entries);
                    initializeIdMap('prop', db.props.entries);
                    initializeIdMap('scene', db.scenes.entries);
                    initializeIdMap('script', db.scripts.entries);
                    initializeIdMap('storyEvent', db.storyEvents.entries);

                    // Initialize processors                    
                    for(var i = 0; i < allProcessors.length; i++) {
                        allProcessors[i].initialize(idMap);
                    }
                }

                function initializeIdMap(dataType, sourceMap) {
                    for (var i = 0; i < sourceMap.length ; i++) {
                        idMap[sourceMap[i].id] = sourceMap[i].name;
                        for(var j = 0; j < allProcessors.length; j++) {
                            allProcessors[j].populateAssetMap(dataType, sourceMap[i]);
                        }
                    }
                }

                function processScripts() {
                    for (var i = 0; i < db.scripts.entries.length ; i++) {
                        var script = db.scripts.entries[i];
                        script.open();

                        var sceneName;
                        // If we're on a scene that is hanging off a prop or a script, use that name instead of the scene name
                        if (null == script.sceneId) {
                            if (null != script.propId) {
                                sceneName = '[Prop : ' + idMap.getDisplayValue(script, 'prop', script.propId) + ' ]';
                            } else if (null != script.actorId) {
                                sceneName = '[Actor: ' + idMap.getDisplayValue(script, 'actor', script.actorId) + ' ]';
                            }
                        } else {
                            sceneName = idMap.getDisplayValue(script, 'scene', script.sceneId);
                        }
                        for(var j = 0; j < allProcessors.length; j++) {
                            var processor = allProcessors[j];
                            processor.parseScript(idMap, sceneName, script);

                            // If the script has entry points defined, parse them too.
                            if (script.item.entryPoints) {
                                processEntryPoints(sceneName, script, processor, script.item.entryPoints);
                            }
                        }
                        script.close();
                    }
                }

                function processEntryPoints(sceneName, script, processor, entryPoints) {
                    if (entryPoints) {
                        for (var i = 0; i < entryPoints.length; i++) {
                            idMap[entryPoints[i].id] = entryPoints[i].name;
                        }
                        for (var i = 0; i < entryPoints.length; i++) {
                            var entryPoint = entryPoints[i];
                            processor.parseEntryPoint(idMap, sceneName, script, entryPoint);

                            if (entryPoint.nodes) {
                                processNodeArray(sceneName, script, processor, entryPoint.nodes);
                            }
                        }
                    }
                }

                function processNodeArray(sceneName, script, processor, nodeArray) {
                    processor.parseNodeArray(idMap, sceneName, script, nodeArray);

                    for(var i = 0; i < nodeArray.length; i++) {
                        processSingleNode(sceneName, script, processor, nodeArray[i]);
                    }
                }

                function processSingleNode(sceneName, script, processor, node) {
                    processor.parseNode(idMap, sceneName, script, node);

                    if (node.success) {
                        processSection(sceneName, script, processor, node.success);
                    }
                    if (node.failure) {
                        processSection(sceneName, script, processor, node.failure);
                    }


                    if (node.nodes) {
                        processNodeArray(sceneName, script, processor, node.nodes);
                    }

                    if (node.sections) {
                        processSectionArray(sceneName, script, processor, node.sections);
                    }

                    if (node.options) {
                        processSectionArray(sceneName, script, processor, node.options);
                    }
                }

                // Process an array of Sections in the script
                function processSectionArray(sceneName, script, processor, sectionArray) {
                    processor.parseSectionArray(idMap, sceneName, sectionArray);

                    for (var i = 0; i < sectionArray.length; i++) {
                        processSection(sceneName, script, processor, sectionArray[i]);
                    }
                }

                function processSection(sceneName, script, processor, section) {
                    processor.parseSection(idMap, sceneName, script, processor, section);

                    if (section.expression) {
                        processExpression(sceneName, script, processor, section.expression);
                    }
                    if (section.nodes) {
                        processNodeArray(sceneName, script, processor, section.nodes);
                    }
                }

                function processTopLevelExpression(scenename, script, processor, expression) {
                    processor.parseTopLevelExpression(idMap, sceneName, script, section.expression);

                    processExpression(sceneName, script, processor, section.expression);
                }

                function processExpression(sceneName, script, processor, expression) {
                    processor.parseExpression(idMap, sceneName, script, expression);

                    if (expression.left) {
                        processExpression(sceneName, script, processor, expression.left);
                    }
                    if (expression.right) {
                        processExpression(sceneName, script, processor, expression.right);
                    }
                }

                generate();
            }).promise();
        }
    };
});