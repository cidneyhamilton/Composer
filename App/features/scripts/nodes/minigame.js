define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.minigameIndex = attributes.minigameIndex || 0;

        this.resultVariable = attributes.resultVariable;
        this.resultVariableScope = attributes.resultVariableScope || 'script';

        this.trapDisarmWord = attributes.trapDisarmWord || '';
        this.trapDisarmDifficulty = attributes.trapDisarmDifficulty || 0;
    };

    ctor.type = 'nodes.minigame';
    ctor.displayName = 'Minigame';

    return ctor;
});