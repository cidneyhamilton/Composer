define(function(require) {
    var NodeEditor = require('./nodeEditor'),
    	loadedConstants = require('features/constants/loadedConstants');

    var ctor = function() {
        NodeEditor.call(this);
        this.skillsAndAtts = loadedConstants.SkillsAndStats.skillsAndAttributes;
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});