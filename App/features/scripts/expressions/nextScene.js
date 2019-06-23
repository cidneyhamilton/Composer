define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.sceneId = attributes.sceneId || null;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var scene = assetDatabase.scenes.lookup[that.sceneId] || { name:'???' };

        var desc = 'next scene is <span class="scene">' + scene.name + '</span> ';

        return desc;
    };

    ctor.type = 'expressions.nextScene';
    ctor.displayName = 'Next Scene';

    return ctor;
});