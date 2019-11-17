define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system'),
        db = require('infrastructure/assetDatabase'),
        scriptMetadataBuilder = require('features/build/data/scriptParsingMetadata'),

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
        unityCodeGenProcessor = require('features/build/data/processors/unityCodeGenProcessor'),
        localizationProcessor = require('features/build/data/processors/localizationProcessor'),
        scriptDataProcessor = require('features/build/data/processors/scriptDataProcessor'),
        inkProcessor = require('features/build/data/processors/inkProcessor'),
        gameModelProcessor = require('features/build/data/processors/gameModelProcessor'),
        proofreadSimpleProcessor = require('features/build/data/processors/proofreadSimpleProcessor'),
        proofreadScriptProcessor = require('features/build/data/processors/proofreadScriptProcessor'),

        selectedGame = require('features/projectSelector/index');

    return {
        run: function(context, localizationDupes) {
            context.indicator.message = 'Generating output...';

            return system.defer(function(dfd){
                var allProcessors = [reportTagUsageProcessor, reportHtmlTagsProcessor, reportResourceUsageProcessor, 
                                     reportVariableUsageProcessor, reportSpeechVariableUsageProcessor,
                                     reportAutosaveUsageProcessor, reportInvokeCommandUsageProcessor, 
                                     reportBadExpressionsProcessor, reportTimeUsageProcessor, reportBadInvokeScriptProcessor, 
                                     reportQuestUsageProcessor, reportBadGuidProcessor, 
                                     gameModelProcessor, localizationProcessor, scriptDataProcessor,
                                     proofreadSimpleProcessor, proofreadScriptProcessor
                                     ];

                if (selectedGame.activeProject.format == 'ink') {
                    allProcessors.push(inkProcessor);
                } else {
					allProcessors.push(unityCodeGenProcessor);
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
                    var assets = ['actors', 'constants', 'props', 'storyEvents', 'scenes', 'scripts', 'localizationGroups'];
                
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

                    // Notify all processors to finish
                    for(var i = 0; i < allProcessors.length; i++) {
                        allProcessors[i].finish(context, idMap);
                    } 
                    
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
                            case 'constants':
                                processor.parseConstant(context, idMap, assetEntry.item);
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
                                if (assetEntry.item.entryPoints && assetEntry.item.entryPoints.length) {
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
                            var epMetadataBuilder = scriptMetadataBuilder.getBuilder(sceneName, script, entryPoint);
                            var epMetadata = epMetadataBuilder.build();
                            processor.parseEntryPoint(idMap, entryPoint, i, epMetadata);

                            if (entryPoint.nodes) {
                                var nodeEpMetadata = epMetadataBuilder.build(1);
                                processNodeArray(processor, entryPoint.nodes, epMetadataBuilder, nodeEpMetadata);
                            }
                            processor.parseEntryPointEnd(idMap, entryPoint, i, epMetadata);
                        }
                    }
                }

                function processNodeArray(processor, nodeArray, epMetadataBuilder, epMetadata) {
                    processor.parseNodeArray(idMap, nodeArray, epMetadata);

                    for(var i = 0; i < nodeArray.length; i++) {
                        processSingleNode(processor, nodeArray[i], i, epMetadataBuilder, epMetadata);
                    }
                    processor.parseNodeArrayEnd(idMap, nodeArray, epMetadata);
                }

                function processSingleNode(processor, node, nodeIndex, epMetadataBuilder, epMetadata) {
                    var nodeType = node.__proto__.constructor.displayName || node.type;

                    processor.parseNode(idMap, node, nodeType, nodeIndex, epMetadata);

                    if (node.success) {
                        processSection(processor, node.success, 0, epMetadataBuilder, epMetadataBuilder.buildSuccessFailure(epMetadata.depth + 1, 'Success'));
                    }
                    if (node.failure) {
                        processSection(processor, node.failure, 0, epMetadataBuilder, epMetadataBuilder.buildSuccessFailure(epMetadata.depth + 1, 'Failure'));
                    }

                    if (node.nodes && node.nodes.length > 0) {
                        processNodeArray(processor, node.nodes, epMetadataBuilder, epMetadataBuilder.build(epMetadata.depth + 1));
                    }

                    if (node.sections && node.sections.length > 0) {
                        processSectionArray(processor, node.sections, epMetadataBuilder, epMetadataBuilder.buildUniqueAutoAdd(epMetadata.depth, node.Unique, node.AutoAddDone), node.type);
                    }

                    if (node.options && node.options.length > 0) {
                        processSectionArray(processor, node.options, epMetadataBuilder, epMetadataBuilder.buildUniqueAutoAdd(epMetadata.depth, node.Unique, node.AutoAddDone), node.type);
                    }
                    processor.parseNodeEnd(idMap, node, nodeType, nodeIndex, epMetadata);
                }

                // Process an array of Sections in the script
                function processSectionArray(processor, sectionArray, epMetadataBuilder, epMetadata, sectionType) {
                    processor.parseSectionArray(idMap, sectionArray, epMetadata, sectionType);

                    for (var i = 0; i < sectionArray.length; i++) {
                        processSection(processor, sectionArray[i], i, epMetadataBuilder, epMetadata);
                    }
                    processor.parseSectionArrayEnd(idMap, sectionArray, epMetadata, sectionType);
                }

                function processSection(processor, section, sectionIndex, epMetadataBuilder, epMetadata) {
                    processor.parseSection(idMap, section, sectionIndex, epMetadata);

                    if (section.expression) {
                        processTopLevelExpression(processor, section.expression, epMetadataBuilder, epMetadata);
                    }
                    if (section.nodes) {
                        processNodeArray(processor, section.nodes, epMetadataBuilder, epMetadataBuilder.buildDeeper(epMetadata));
                    }
                    processor.parseSectionEnd(idMap, section, sectionIndex, epMetadata);
                }

                function processTopLevelExpression(processor, expression, epMetadataBuilder, epMetadata) {
                    processor.parseTopLevelExpression(idMap, expression, epMetadata);

                    processExpression(processor, expression, epMetadataBuilder, epMetadata);
                }

                function processExpression(processor, expression, epMetadataBuilder, epMetadata) {
                    processor.parseExpression(idMap, expression, epMetadata);

                    if (expression.left) {
                        processExpression(processor, expression.left, epMetadataBuilder, epMetadata);
                    }
                    if (expression.right) {
                        processExpression(processor, expression.right, epMetadataBuilder, epMetadata);
                    }
                }

                setTimeout(function() { generate(); }, 100);
            }).promise();
        }
    };
});
