define(function(require) {
    var NodeEditor = require('./nodeEditor'),
    	skillsAndAttributes = require('features/constants/skillsAndAttributes');

    var ctor = function() {
        NodeEditor.call(this);
        this.skillsAndAtts = skillsAndAttributes.skillsAndAttributes;
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});