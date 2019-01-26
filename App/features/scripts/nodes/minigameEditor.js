define(function(require) {
    var NodeEditor = require('./nodeEditor'),
        minigamesMap = require('features/constants/minigames'),
        observable = require('plugins/observable');

    var ctor = function() {
        NodeEditor.call(this);
        this.scopes = ['script', 'target', 'scene', 'event', 'ego'];

        observable.defineProperty(this, 'minigamesMap', function() {
        	return minigamesMap;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});