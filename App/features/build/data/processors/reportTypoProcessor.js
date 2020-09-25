define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');
    
    var ctor = function () {
        baseReportProcessor.call(this, 'typos');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseTypos = function(text, sceneName, scriptName) {
	this.report.log(text, "", "");
    };
    
    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        if (node.description) {
            this.parseTypos(node.description, epMetadata.sceneName, epMetadata.script.name);
        }
        if (node.text) {
            this.parseTypos(node.text, epMetadata.sceneName, epMetadata.script.name);
        }
        if (node.title) {
            this.parseTypos(node.title, epMetadata.sceneName, epMetadata.script.name);
        }
    };

    return new ctor();
});
