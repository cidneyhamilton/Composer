define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        ConditionEditor = require('./conditionEditor');

    var ctor = function() {
        this.actors = assetDatabase.actors.entries;
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});
