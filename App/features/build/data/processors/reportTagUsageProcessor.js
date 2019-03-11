define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor'),
        path = requireNode('path'),
        commaDelimiter = /\s*,\s*/;

    var ctor = function () {        
        baseReportProcessor.call(this, 'tagUsage', 'badTagUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.registerTags = function(source, tagNames, addRemoveOrCheck) {
        var splitTagNames = tagNames.split(commaDelimiter);
        for (var i in splitTagNames) {
            this.report.log(splitTagNames[i].replace(/\s/g,'').toLowerCase(), source, addRemoveOrCheck);
        }
    };

    ctor.prototype.parseInitialTags = function(idMap, assetType, assetEntry) {
        // Register any tags defined on those objects
        if (assetEntry.components && assetEntry.components.length > 0) {
            for (var i = 0; i < assetEntry.components.length; i++) {
                if ('components.initialTags' == assetEntry.components[i].type) {
                    this.registerTags(assetType + ":" + idMap[assetEntry.id], assetEntry.components[i].tags, 'Initialized');
                }
            }
        }
    };

    ctor.prototype.parseScene = function(context, idMap, scene) {
        this.parseInitialTags(idMap, 'scene', scene);
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        this.parseInitialTags(idMap, 'actor', actor);
    };

    ctor.prototype.parseStoryEvent = function(context, idMap, storyEvent) {
        this.parseInitialTags(idMap, 'storyEvent', storyEvent);
    };

    ctor.prototype.parseProp = function(context, idMap, prop) {
        this.parseInitialTags(idMap, 'prop', prop);
    };

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        this.parseInitialTags(idMap, 'script', script);
    };

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        var displayScope = idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, node.scope, node.scopeId);
        if (node.tagsToAdd) {
            this.registerTags(displayScope ? (node.scope + ' : ' + displayScope) : (epMetadata.sceneName + ' : ' + epMetadata.script.name), node.tagsToAdd, 'Added');
        }
        if (node.tagsToRemove) {
            this.registerTags(displayScope ? (node.scope + ' : ' + displayScope) : (epMetadata.sceneName + ' : ' + epMetadata.script.name), node.tagsToRemove, 'Removed');
        }
    };

    ctor.prototype.parseExpression = function(idMap, expression, epMetadata) {
        if (expression.tags) {
            this.registerTags(expression.scopeId ? 
                (expression.scope + ' : ' + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, expression.scope, expression.scopeId)) 
                : (epMetadata.sceneName + ' : ' + epMetadata.script.name), expression.tags, 'Check : ' + (expression.has ? 'Has' : 'Not Tagged With')
            );
        }
    };

    ctor.prototype.finish = function(context, idMap) {

        // also generate the bad tags report, since it's basically a subset of the Tags report.
        for(var i in this.report.UsageList) {
            var tag = this.report.UsageList[i];
            for (var j in this.report.WithParamsMap[tag]) {
                var isBadTag = false;
                var target = this.report.WithParamsMap[tag][j];
                var numTagsUsed = Object.keys(this.report.FullMap[tag][target]).length;
                // If this tag is only accessed once, it's probably a bad tag.
                if (numTagsUsed <= 1) {
                    isBadTag = true;
                } else {
                    var isChecked = false;
                    var isAdded = false;
                    for (var k in Object.keys(this.report.FullMap[tag][target])) {
                        var howTagIsUsed = Object.keys(this.report.FullMap[tag][target])[k];
                        if (howTagIsUsed.indexOf('Check') != -1) {
                            isChecked = true;
                        } else if (howTagIsUsed.indexOf('Add') != -1) {
                            isAdded = true;
                        }
                    }
                    // If this tag is never added or checked, it's probably a bad tag.
                    isBadTag = !isChecked || !isAdded;
                }

                if (isBadTag) {
                    for (var k in Object.keys(this.report.FullMap[tag][target])) {
                        this.reports['badTagUsage'].log(tag, target, Object.keys(this.report.FullMap[tag][target])[k]);
                    }
                }
            }
        }

        baseReportProcessor.prototype.finish.call(this, context, idMap);
    };

    return new ctor();
});