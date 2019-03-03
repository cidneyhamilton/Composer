define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'autosaveUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {
        if ('AutoSave' == node.__proto__.constructor.displayName) {
            this.report.log(sceneName + ' : ' + script.name, 'AutoSave');
        }
    };

    return new ctor();
});