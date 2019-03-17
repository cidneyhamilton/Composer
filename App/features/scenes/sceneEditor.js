define(function(require) {
    var Editor = require('features/shared/editor'),
        SceneDetail = require('./sceneDetail'),
        PropsIndex = require('features/props/index');

    var selectedGame = require('features/projectSelector/index');

    var ctor = function(owner, entry) {
        Editor.call(this, owner, entry, new SceneDetail(), 'sceneId');
        Editor.currentSceneId = entry.id;
        
        // Show props for this scene if there are props in the UI
        if (selectedGame.showAdvanced) {
            this.screens.splice(1, 0, new PropsIndex(this, entry.id));
        }
    };

    Editor.baseOn(ctor);

    return ctor;
});