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

            var scripts = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.id == scriptId;
                    });
            return scripts[0] || { name: '???' };
        });

        observable.defineProperty(this, 'endRoundScript', function(){
            var scriptId = this.node.endRoundScript;

            var scripts = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.id == scriptId;
                    });
            return scripts[0] || { name: '???' };
        });

        observable.defineProperty(this, 'endGameScript', function(){
            var scriptId = this.node.endGameScript;

            var scripts = assetDatabase.scripts.entries.filter(function(entry){
                        return entry.id == scriptId;
                    });
            return scripts[0] || { name: '???' };
        });


        observable.defineProperty(this, 'minigamesMap', function() {
            return minigamesMap;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});