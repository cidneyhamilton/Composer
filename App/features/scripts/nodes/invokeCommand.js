define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.entityType = attributes.entityType;
        this.entityFilterId = attributes.entityFilterId;
        this.entityId = attributes.entityId;
        this.command = attributes.command;
        this.parameter = attributes.parameter;
        this.wait = attributes.wait;
        this.resultVariable = attributes.resultVariable;
        this.resultVariableScope = attributes.resultVariableScope || 'script';
    };

    ctor.type = 'nodes.invokeCommand';
    ctor.displayName = 'Invoke Command';

    return ctor;
});