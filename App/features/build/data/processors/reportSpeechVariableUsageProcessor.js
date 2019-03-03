define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor'),
        scopeAndVariableRegex = /(\$\{([^\}]+)\})/ig;

    var ctor = function () {
        baseReportProcessor.call(this, 'speechScopeAndVariableUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {
        if (node.text) {
            var allScopeAndVariableUsages = node.text.match(scopeAndVariableRegex);
            if (allScopeAndVariableUsages) {
                for (var i in allScopeAndVariableUsages) {
                    this.report.log(sceneName + ' : ' + script.name, node.text, allScopeAndVariableUsages[i]);
                }
            }
        }
    };

    return new ctor();
});