define(function(require) {
    var serializer = require('plugins/serializer'),
        nodeRegistry = require('./nodes/registry'),
        triggerRegistry = require('./triggers/registry'),
        expressionRegistry = require('./expressions/registry'),
        optionRegistry = require('./nodes/options/registry'),
        variableRegistry = require('./variables/registry');

    return {
        install: function() {
            serializer.registerType(require('./script'));
            serializer.registerType(require('./entryPoint'));

            nodeRegistry.install();
            triggerRegistry.install();
            expressionRegistry.install();
            optionRegistry.install();
            variableRegistry.install();
        }
    };
});