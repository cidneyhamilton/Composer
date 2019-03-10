define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'badInvokeScriptCurrentMain');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        if (node.currentScope && node.currentScope == 'Current') {
            var entryPointName = idMap[node.entryPointId];
            if ("Main" == entryPointName) {
                this.report.log(epMetadata.sceneName + ' : ' +  epMetadata.script.name + ' (file: Composer/Data/Scripts/' + epMetadata.script.id + '.json)', "Current: Main detected.");
            } else if ('' == node.entryPointId || null == node.entryPointId || !node.entryPointId) {
                this.report.log(epMetadata.sceneName + ' : ' + epMetadata.script.name + ' (file: Composer/Data/Scripts/' + epMetadata.script.id + '.json)', "Current scope set, but no EntryPoint defined.");
            } else if (node.entryPointId && '' != node.entryPointId && null != node.entryPointId && !entryPointName) {
                this.report.log(epMetadata.sceneName + ' : ' +  epMetadata.script.name + ' (file: Composer/Data/Scripts/' + epMetadata.script.id + '.json)', "Entry Point [" + node.entryPointId + "] not found in associated script: [" + node.scriptId + "]");
            }
        }
    };

    return new ctor();
});