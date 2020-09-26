define(function(require) {
    var baseReportProcessor = require('features/build/data/processors/basereportProcessor');

    var ctor = function () {
	baseReportProcessor.call(this, 'voiceActing');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
	if (nodeType == "Speak") {
	    var actorName = idMap[node.actorId];
		this.report.log(actorName + ": " + node.text, "", "");
	}
    };
    
    return new ctor();
});
