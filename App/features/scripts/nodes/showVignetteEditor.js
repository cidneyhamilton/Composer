define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.vignettes = assetDatabase.vignettes.entries;



        observable.defineProperty(this, 'vignette', function(){
            var name = this.node.vignetteName;

            var results = this.vignettes.filter(function(item){
                return item == name;
            });

            return results[0] || '???';
        });

        observable.defineProperty(this, 'vignetteSrc', function(){
            var fullname = assetDatabase.vignettes.dataDirectory + "/" + this.node.vignetteName;
            return fullname;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});