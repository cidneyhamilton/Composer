define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.images = assetDatabase.closeUps.entries;
        this.images.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase())
            }
        );


        observable.defineProperty(this, 'image', function(){
            var name = this.node.imageName;

            var results = this.images.filter(function(item){
                return item == name;
            });




            return results[0] || '???';
        });

        observable.defineProperty(this, 'imageSrc', function(){
            var fullname = assetDatabase.closeUps.dataDirectory + "/" + this.node.imageName;
            return fullname;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});