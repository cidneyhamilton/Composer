define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        SceneEditor = require('./sceneEditor'),
        Index = require('features/shared/index');

    var ctor = function() {
        Index.call(this, assetDatabase.scenes, SceneEditor);
    };

    Index.baseOn(ctor);

    return new ctor();
});