define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'variableUsage', 'badVariableUsage');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {
        var nodeType = node.__proto__.constructor.displayName;
        if ('Variable' == nodeType) {
            this.report.log(node.name, node.scope, sceneName + ' : ' + script.name);
        }
    };

    ctor.prototype.parseExpression = function(idMap, sceneName, script, expression) {
        if (expression.variableName) {
            this.report.log(expression.variableName, expression.variableScope, sceneName + ' : ' + script.name);
        }
    };

    ctor.prototype.finish = function(context, idMap) {
        // also generate the bad variables report, since it's basically a subset of the variables report.
        for(var i in this.report.UsageList) {
            var variable = this.report.UsageList[i];
            // If this variable has > 2 scopes, it may be a bad variable
            if (this.report.WithParamsMap[variable].length > 1) {
                for (var j in this.report.WithParamsMap[variable]) {
                    var target = this.report.WithParamsMap[variable][j];
                    for (var k in Object.keys(this.report.FullMap[variable][target])) {
                        this.reports['badVariableUsage'].log(variable, target, Object.keys(this.report.FullMap[variable][target])[k]);
                    }
                }
            }
        }
        baseReportProcessor.prototype.finish.call(this, context);
    };

    return new ctor();
});