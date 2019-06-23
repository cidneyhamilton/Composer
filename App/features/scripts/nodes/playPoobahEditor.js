define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        minigamesMap = require('features/constants/minigames'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor');

    var ctor = function() {
        NodeEditor.call(this);

        observable.defineProperty(this, 'scripts', function(){
            var scripts = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.triggerType == 'triggers.poobah';
                    });
            return scripts;
        });


        observable.defineProperty(this, 'startGameScript', function(){
            var scriptId = this.node.startGameScript;

            return assetDatabase.scripts.lookup[scriptId] || { name: '???' };
        });

        observable.defineProperty(this, 'endRoundScript', function(){
            var scriptId = this.node.endRoundScript;

            return assetDatabase.scripts.lookup[scriptId] || { name: '???' };
        });

        observable.defineProperty(this, 'endGameScript', function(){
            var scriptId = this.node.endGameScript;

            return assetDatabase.scripts.lookup[scriptId] || { name: '???' };
        });


        observable.defineProperty(this, 'minigamesMap', function() {
            return minigamesMap;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});