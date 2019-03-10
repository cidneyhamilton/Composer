define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor'),
        questOp = ['Added','Completed','Failed'];

    var ctor = function () {
        baseReportProcessor.call(this, 'allQuests');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        if ('Quests' == nodeType) {
            this.report.log(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId), questOp[node.target], epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
    };

    return new ctor();
});