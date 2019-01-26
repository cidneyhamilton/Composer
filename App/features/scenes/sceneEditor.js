define(function(require) {
    var Editor = require('features/shared/editor'),
        SceneDetail = require('./sceneDetail'),
        PropsIndex = require('features/props/index');

    var ctor = function(owner, entry) {
        Editor.call(this, owner, entry, new SceneDetail(), 'sceneId');
        Editor.currentSceneId = entry.id;
        
        this.screens.splice(1, 0, new PropsIndex(this, entry.id));
    };

    Editor.baseOn(ctor);

    return ctor;
});