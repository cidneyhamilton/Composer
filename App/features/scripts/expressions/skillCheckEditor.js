define(function(require) {
    var ConditionEditor = require('./conditionEditor'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function() { 
        this.skillsAndAtts = loadedConstants.SkillsAndStats.skillsAndAttributes;
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});