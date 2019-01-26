define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);
        this.availableScope = ['FadeOutAndIn', 'FadeIn', 'FadeOut']; // Joshua Should probably have been an index to convert to an enum C# side but oh well.
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});