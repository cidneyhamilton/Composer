define(function(require) {
    var NodeEditor = require('./nodeEditor'),
        loadedConstants = require('features/constants/loadedConstants'),
        observable = require('plugins/observable');

    var ctor = function() {
        NodeEditor.call(this);

        observable.defineProperty(this, 'skillsAndAttributesMap', function() {
        	return loadedConstants.SkillsAndStats;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});