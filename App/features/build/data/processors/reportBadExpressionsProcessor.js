define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    function getExpressionId(sceneName, scriptEntry, expressionEntry) {
        return sceneName + "_" + scriptEntry.name + "_" + expressionEntry.getDescription();
    }

    var expressionHolder = function(sceneName, scriptEntry, expressionEntry) {
        var item = {
            id: getExpressionId(sceneName, scriptEntry, expressionEntry),
            scene: sceneName,
            script: scriptEntry.name,
            expression: expressionEntry.getDescription(),
            conditionals: {}
        };
        return item;
    }

    var ctor = function () {
        baseReportProcessor.call(this, 'badExpressions');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;    

    ctor.prototype.init = function() {
        baseReportProcessor.prototype.init.call(this);
        this.expressions = {};
        this.expressionParentLookup = {};
    };

    ctor.prototype.getExpressionParent = function(expressionId) {
        var parentId = this.expressionParentLookup[expressionId];
        return this.expressions[parentId];
    };
    
    ctor.prototype.setExpressionParent = function(expressionId, parentExpressionId) {
        this.expressionParentLookup[expressionId] = parentExpressionId;
    };

    ctor.prototype.parseTopLevelExpression = function(idMap, sceneName, script, expression) {
        var expSummary = expressionHolder(sceneName, script, expression);
        this.expressions[expSummary.id] = expSummary;
        this.setExpressionParent(expSummary.id, expSummary.id);
    };

    ctor.prototype.parseExpression = function(idMap, sceneName, script, expression) {
        var expSummaryId = getExpressionId(sceneName, script, expression);
        var expParent = this.getExpressionParent(expSummaryId);
        if ('expressions.or' == expression.type) {
            expParent.conditionals['or'] = true;
        } else if ('expressions.and' == expression.type) {
            expParent.conditionals['and'] = true;
        }

        if (expression.left) {
            this.setExpressionParent(getExpressionId(sceneName, script, expression.left), expParent.id);
        }
        if (expression.right) {
            this.setExpressionParent(getExpressionId(sceneName, script, expression.right), expParent.id);
        }
    };

    ctor.prototype.finish = function(context, idMap) {
        for (var expId in this.expressions) {
            var expHolder = this.expressions[expId];
            if (Object.keys(expHolder.conditionals).length == 2) {
                this.report.log(expHolder.scene + ' : ' + expHolder.script, expHolder.expression);
            }
        }

        baseReportProcessor.prototype.finish.call(this, context);
    }

    return new ctor();
});