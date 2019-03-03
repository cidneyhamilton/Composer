define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor'),
        questOp = ['Added','Completed','Failed'];

    var ctor = function () {
        baseReportProcessor.call(this, 'allQuests');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {
        var nodeType = node.__proto__.constructor.displayName;

        if ('Quests' == nodeType) {
            this.report.log(idMap.getDisplayValue(sceneName, script, 'prop', node.propId), questOp[node.target], sceneName + ' : ' + script.name);
        }
    };

    return new ctor();
});