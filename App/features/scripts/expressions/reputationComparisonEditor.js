define(function(require) {
    var ConditionEditor = require('./conditionEditor'),
        assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function() {
        this.actors = assetDatabase.actors.entries;
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});