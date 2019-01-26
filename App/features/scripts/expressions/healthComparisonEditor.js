define(function(require) {
    var ConditionEditor = require('./conditionEditor');

    var ctor = function() {
        this.scopes = ['script', 'target', 'scene', 'event', 'ego'];
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});
