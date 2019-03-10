define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'invokeCommandUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        if (node.command) {
            var displayParameters = node.parameter;
            if (!displayParameters) {
                displayParameters = "(none)";
            }

            this.report.log(node.command, displayParameters, epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
    };

    return new ctor();
});