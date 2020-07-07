define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor'),
	assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function () {
        baseReportProcessor.call(this, 'badResources');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex) {

	// Given a resourceType and a database of resources, report if this node has a missing resource
	var isMissingResource = function(resourceType, resources, imageName) {	    
	    if (nodeType == resourceType) {
		var results = resources.filter(function(item) {
		    return item == imageName;
		});

		if (results.length == 0) {
		    return true;
		} else {
		    return false;
		}
	    }
	};

	    
	if (isMissingResource('Show Close Up', assetDatabase.closeUps.entries, node.imageName)) {
	    this.report.log("Missing Close Up: " + node.imageName);
	}
	
	if (isMissingResource('Show Vignette', assetDatabase.vignettes.entries, node.vignetteName)) {
	    this.report.log("Missing Vignette: " + node.vignetteName);
	}
	
    };

    ctor.prototype.finish = function(context, idMap) {       
        baseReportProcessor.prototype.finish.call(this, context, idMap);	
    };

    return new ctor();
});
