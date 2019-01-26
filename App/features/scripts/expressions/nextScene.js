define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.sceneId = attributes.sceneId || null;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var results = assetDatabase.scenes.entries.filter(function(item){
            return item.id == that.sceneId;
        });

        var scene = results[0] || { name:'???' };

        var desc = 'next scene is <span class="scene">' + scene.name + '</span> ';

        return desc;
    };

    ctor.type = 'expressions.nextScene';
    ctor.displayName = 'Next Scene';

    return ctor;
});