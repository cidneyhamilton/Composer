define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'timeUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        if ('Increment Time' == nodeType) {
            this.report.log(epMetadata.sceneName + ' : ' + epMetadata.script.name, 'Increment Time by : ' + ((Math.abs(node.days) > 0) ? (node.days + ' day(s), ') : '') + ((Math.abs(node.hours) > 0) ? (node.hours + ' hour(s), ') : '')  + ((Math.abs(node.minutes) > 0) ? (node.minutes + ' minute(s)') : '') );
        } else if ('Set Time' == nodeType) {
            this.report.log(epMetadata.sceneName + ' : ' + epMetadata.script.name, 'Set Time to: Day ' + node.day + ', ' + (Math.abs(node.hour) < 10 ? '0' : '') + node.hour + ':' + (Math.abs(node.minute) < 10 ? '0' : '') + node.minute);
        }
    };

    return new ctor();
});