define(function(require) {
    var NodeEditor = require('./nodeEditor'),
        skillsAndAttributesMap = require('features/constants/skillsAndAttributes'),
        observable = require('plugins/observable');

    var ctor = function() {
        NodeEditor.call(this);

        observable.defineProperty(this, 'skillsAndAttributesMap', function() {
        	return skillsAndAttributesMap;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});