define(function (require) {
    var dialog = require('plugins/dialog'),
        ConditionEditor = require('./conditionEditor');

    var ctor = function() { };

    ConditionEditor.baseOn(ctor);

    return ctor;
});