define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        ConditionEditor = require('./conditionEditor');

    var ctor = function () {
        this.storyEvents = assetDatabase.storyEvents.entries;
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});
