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

        var desc = 'previous scene was <span class="scene">' + scene.name + '</span> ';

        return desc;
    };

    ctor.type = 'expressions.previousScene';
    ctor.displayName = 'Previous Scene';

    return ctor;
});