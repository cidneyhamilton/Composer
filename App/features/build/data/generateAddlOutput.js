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

                var idMap = {};    // Map of [GUID, <Name of [Actor | Prop | Scene | Script | StoryEvent]> ]
                var allProcessors = [tagUsageReportProcessor];

                function generate() {

                    // Populate the idMap
                    populateIdMap();

                    // Iterate over each script
                    processScripts();
                
                    for(var i = 0; i < allProcessors.length; i++) {
                        allProcessors[i].finish(context);
                    } 
                    
                    context.completed.push('features/build/data/internalDoc');
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
                        for(var j = 0; j < allProcessors.length; j++) {
                            allProcessors[j].parseScript(idMap, script);
                        }
                        script.close();
                    }
                }

                generate();
            }).promise();
        }
    };
});