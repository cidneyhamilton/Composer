define(function(require) {
    var ConditionEditor = require('./conditionEditor'),
    	skillsAndAttributes = require('features/constants/skillsAndAttributes');

    var ctor = function() { 
        this.skillsAndAtts = skillsAndAttributes.skillsAndAttributes;
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});