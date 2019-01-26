define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.soundEffects = assetDatabase.soundEffects.entries;

        observable.defineProperty(this, 'soundEffectSrc', function(){
            var fullname = assetDatabase.soundEffects.dataDirectory + "/" + this.node.soundEffectName;
            return fullname;
        });

        this.playSound = function()
        {
            var fullname = assetDatabase.soundEffects.dataDirectory + "/" + this.node.soundEffectName;
            var snd = new Audio(fullname); // buffers automatically when created
            snd.play();
        };

    };

    NodeEditor.baseOn(ctor);

    return ctor;
});