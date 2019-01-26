define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        NodeEditor = require('./nodeEditor');

    var ctor = function() {
        NodeEditor.call(this);

        this.musicTracks = assetDatabase.musicTracks.entries;
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});