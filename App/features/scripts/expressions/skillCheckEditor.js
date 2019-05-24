define(function(require) {
    var ConditionEditor = require('./conditionEditor'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function() { 
        this.skillsAndAtts = loadedConstants.constants.SkillsAndStats.skillsAndAttributes;
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});