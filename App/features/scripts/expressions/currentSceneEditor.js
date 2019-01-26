define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        ConditionEditor = require('./conditionEditor');

    var ctor = function() {
        this.scenes = assetDatabase.scenes.entries;
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});
