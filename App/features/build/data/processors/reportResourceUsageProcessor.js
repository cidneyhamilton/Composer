define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'resourceUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        if (node.movie) {
           this.report.log("Movies", node.movie, epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
        if (node.musicTrack) {
            this.report.log("Music", node.musicTrack, epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
        if (node.soundEffectName) {
            this.report.log("Sounds", node.soundEffectName, epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
        if (node.animationName) {
            this.report.log("Animations", node.animationName, epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
        if (node.imageName) {
            this.report.log("Images", node.imageName, epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
        if (node.vignetteName) {
            this.report.log("vignettes", node.vignetteName, epMetadata.sceneName + ' : ' + epMetadata.script.name);
        }
    };

    return new ctor();
});