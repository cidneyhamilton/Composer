define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor'),
        InkWriter = require('infrastructure/inkWriter'),
        path = requireNode('path'),
        commaDelimiter = /\s*,\s*/;

    var ctor = function () {        
        baseReportProcessor.call(this, 'tagUsage');
        this.tagsToInit = [];
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.populateAssetMap = function(assetType, assetEntry) {
        // This is really stupid, but no other way to access the components...
        var openedEntry = assetEntry.open();
        if (openedEntry.components && openedEntry.components.length > 0) {
            for (var i = 0; i < openedEntry.components.length; i++) {
                if ('components.initialTags' == openedEntry.components[i].type) {
                    this.tagsToInit.push({
                        type: assetType,
                        tags: openedEntry.components[i].tags,
                        sourceId: openedEntry.id
                    });
                }
            }
        }
        assetEntry.close();
    };

    ctor.prototype.initialize = function(idMap) {
        // Register any tags defined on those objects
        for (var i = 0; i < this.tagsToInit.length; i++) {
            this.registerTags(this.tagsToInit[i].type + ':' + idMap[this.tagsToInit[i].sourceId], this.tagsToInit[i].tags, 'Initialized');
        }
        delete this.tagsToInit;
    };

    ctor.prototype.registerTags = function(source, tagNames, addRemoveOrCheck) {
        var splitTagNames = tagNames.split(commaDelimiter);
        for (var i in splitTagNames) {
            this.report.log(splitTagNames[i].replace(/\s/g,'').toLowerCase(), source, addRemoveOrCheck);
        }
    };



    ctor.prototype.parseScript = function(idMap, sceneName, script) {
        // TODO
    };


    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {
        var displayScope = idMap.getDisplayValue(script, node.scope, node.scopeId);
        if (node.tagsToAdd) {
            this.registerTags(displayScope ? (node.scope + ' : ' + displayScope) : (sceneName + ' : ' + script.name), node.tagsToAdd, 'Added');
        }
        if (node.tagsToRemove) {
            this.registerTags(displayScope ? (node.scope + ' : ' + displayScope) : (sceneName + ' : ' + script.name), node.tagsToRemove, 'Removed');
        }
    };

    ctor.prototype.parseExpression = function(idMap, sceneName, script, expression) {
        if (expression.tags) {
            if ('script' == sceneName) {
                debugger;
            }
            this.registerTags(expression.scopeId ? 
                (expression.scope + ' : ' + idMap.getDisplayValue(script, expression.scope, expression.scopeId)) 
                : (sceneName + ' : ' + script.name), expression.tags, 'Check : ' + (expression.has ? 'Has' : 'Not Tagged With')
            );
        }
    };

    ctor.prototype.finish = function(context) {
        baseReportProcessor.prototype.finish.call(this, context);
        if (context.game.format == 'ink') {
            var writer = InkWriter.createFileWriter(path.join(context.dataOutputDirectory, 'AllTags'));
            writer.writeList("TAGS", this.report.UsageList);
            writer.end();
        }
    };

    return new ctor();
});