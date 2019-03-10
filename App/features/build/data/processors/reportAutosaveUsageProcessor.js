define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'autosaveUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        if ('AutoSave' == nodeType) {
            this.report.log(epMetadata.sceneName + ' : ' + epMetadata.script.name, 'AutoSave');
        }
    };

    return new ctor();
});