define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'resourceUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {
        if (node.movie) {
           this.report.log("Movies", node.movie, sceneName + ' : ' + script.name);
        }
        if (node.musicTrack) {
            this.report.log("Music", node.musicTrack, sceneName + ' : ' + script.name);
        }
        if (node.soundEffectName) {
            this.report.log("Sounds", node.soundEffectName, sceneName + ' : ' + script.name);
        }
        if (node.animationName) {
            this.report.log("Animations", node.animationName, sceneName + ' : ' + script.name);
        }
        if (node.imageName) {
            this.report.log("Images", node.imageName, sceneName + ' : ' + script.name);
        }
        if (node.vignetteName) {
            this.report.log("vignettes", node.vignetteName, sceneName + ' : ' + script.name);
        }
    };

    return new ctor();
});