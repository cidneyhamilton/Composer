define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system'),
        db = require('infrastructure/assetDatabase'),

        // Processors
        reportAutosaveUsageProcessor = require('features/build/data/processors/reportAutosaveUsageProcessor'),
        reportBadExpressionsProcessor = require('features/build/data/processors/reportBadExpressionsProcessor'),
        reportBadGuidProcessor = require('features/build/data/processors/reportBadGuidProcessor'),
        reportBadInvokeScriptProcessor = require('features/build/data/processors/reportBadInvokeScriptProcessor'),
        reportTagUsageProcessor = require('features/build/data/processors/reportTagUsageProcessor'),
        reportHtmlTagsProcessor = require('features/build/data/processors/reportHtmlTagsProcessor'),
        reportResourceUsageProcessor = require('features/build/data/processors/reportResourceUsageProcessor'),
        reportVariableUsageProcessor = require('features/build/data/processors/reportVariableUsageProcessor'),
        reportSpeechVariableUsageProcessor = require('features/build/data/processors/reportSpeechVariableUsageProcessor'),
        reportInvokeCommandUsageProcessor = require('features/build/data/processors/reportInvokeCommandUsageProcessor'),
        reportTimeUsageProcessor = require('features/build/data/processors/reportTimeUsageProcessor'),
        reportQuestUsageProcessor = require('features/build/data/processors/reportQuestUsageProcessor'),
        codeGenProcessor = require('features/build/data/processors/codeGenProcessor'),
        localizationProcessor = require('features/build/data/processors/localizationProcessor'),
        scriptDataProcessor = require('features/build/data/processors/scriptDataProcessor'),
        inkProcessor = require('features/build/data/processors/inkProcessor'),
        gameModelProcessor = require('features/build/data/processors/gameModelProcessor'),
        selectedGame = require('features/projectSelector/index');

    return {
        run: function(context, localizationDupes) {
            context.indicator.message = 'Generating additional output...';

            return system.defer(function(dfd){
                var allProcessors = [reportTagUsageProcessor, reportHtmlTagsProcessor, reportResourceUsageProcessor, 
                                     reportVariableUsageProcessor, reportSpeechVariableUsageProcessor,
                                     reportAutosaveUsageProcessor, reportInvokeCommandUsageProcessor, 
                                     reportBadExpressionsProcessor, reportTimeUsageProcessor, reportBadInvokeScriptProcessor, 
                                     reportQuestUsageProcessor, reportBadGuidProcessor, 
                                     gameModelProcessor, codeGenProcessor, localizationProcessor, scriptDataProcessor];

                if (selectedGame.activeProject.format == 'ink') {
                    allProcessors.push(inkProcessor);
                }

                // Map of [GUID, <Name of [Actor | Prop | Scene | Script | StoryEvent]> ]
                var idMap = {
                    badIds: [],
                    getDisplayValue: function(sceneName, script, type, typeId) {
                        var displayValue;
                        switch(type){
                            case 'actor':
                            case 'prop':
                            case 'scene':
                            case 'script':
                            case 'storyEvent':
                            case 'entryPoint':
                                if (typeId && null != typeId && !idMap[typeId]) {
                                    this.badIds.push({
                                        scriptId: script.id,
                                        scriptName: script.name,
                                        sceneName: sceneName,
                                        typeId: typeId,
                                        type: type
                                    });
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

                };

                function generate() {
                    var assets = ['actors', 'props', 'storyEvents', 'scenes', 'scripts', 'localizationGroups'];
                
                    // Initialize the processors
                    for(var i = 0; i < allProcessors.length; i++) {
                        allProcessors[i].init();
                    }

                    // Populate the idMap
                    for (var i = 0; i < assets.length; i++) {
                        var assetEntries = db[assets[i]].entries;
                        for (var j = 0; j < assetEntries.length; j++) {
                            var assetEntry = assetEntries[j];
                             idMap[assetEntry.id] = assetEntry.name;
                        }
                    }

                    // Iterate over each asset
                    for (var i = 0; i < assets.length; i++) {
                        var assetEntries = db[assets[i]].entries;
                        for (var j = 0; j < assetEntries.length; j++) {
                            processAsset(assets[i], assetEntries[j]);
                        }
                    }
                
                    for(var i = 0; i < allProcessors.length; i++) {
                        allProcessors[i].finish(context, idMap);
                    } 
                    
                    context.completed.push('features/build/data/generateAddlOutput');
                    dfd.resolve();
                }

                function processAsset(assetType, assetEntry) {
                    var sceneName;
                    assetEntry.open();

                    if ('scripts' == assetType) {
                        // If we're on a scene that is hanging off a prop or a script, use that name instead of the scene name
                        if (null == assetEntry.sceneId) {
                            if (null != assetEntry.propId) {
                                sceneName = '[Prop : ' + idMap.getDisplayValue('Prop: ' + assetEntry.propId, assetEntry, 'prop', assetEntry.propId) + ' ]';
                            } else if (null != assetEntry.actorId) {
                                sceneName = '[Actor: ' + idMap.getDisplayValue('Actor: ' + assetEntry.actorId, assetEntry, 'actor', assetEntry.actorId) + ' ]';
                            }
                        } else {
                            sceneName = idMap.getDisplayValue('Scene: ' + assetEntry.sceneId, assetEntry, 'scene', assetEntry.sceneId);
                        }
                    } 
                    for(var i = 0; i < allProcessors.length; i++) {
                        var processor = allProcessors[i];
                        switch (assetType) {
                            case 'actors':
                                processor.parseActor(context, idMap, assetEntry.item);
                                break;
                            case 'localizationGroups':
                                processor.parseLocalizationGroup(context, idMap, assetEntry.item);
                                break;
                            case 'props':
                                processor.parseProp(context, idMap, assetEntry.item);
                                break;
                            case 'storyEvents':
                                processor.parseStoryEvent(context, idMap, assetEntry.item);
                                break;
                            case 'scenes':
                                processor.parseScene(context, idMap, assetEntry.item);
                                break;
                            case 'scripts': 
                                processor.parseScript(context, idMap, assetEntry.item, sceneName);

                                // If the script has entry points defined, parse them too.
                                if (assetEntry.item.entryPoints) {
                                    processEntryPoints(sceneName, assetEntry.item, processor, assetEntry.item.entryPoints);
                                }
                                break;
                        }
                    }
                    assetEntry.close();
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
                        processTopLevelExpression(sceneName, script, processor, section.expression);
                    }
                    if (section.nodes) {
                        processNodeArray(sceneName, script, processor, section.nodes);
                    }
                }

                function processTopLevelExpression(sceneName, script, processor, expression) {
                    processor.parseTopLevelExpression(idMap, sceneName, script, expression);

                    processExpression(sceneName, script, processor, expression);
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