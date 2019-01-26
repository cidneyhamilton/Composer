define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var props = assetDatabase.props.entries;

    var ctor = function() {
        NodeEditor.call(this);
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});
