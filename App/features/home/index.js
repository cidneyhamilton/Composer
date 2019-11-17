define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
    selectedGame = require('features/projectSelector/index');

    // All games use constants, scenes, actors, props, and scripts
    var assets = [
            assetDatabase.constants,
            assetDatabase.scenes,
            assetDatabase.actors,
            assetDatabase.scripts,
            assetDatabase.props
        ];

    // In the advanced version of the game, include events
    if (selectedGame.showAdvanced) {
        assets.push(assetDatabase.storyEvents);
    }

    var index = {
        assets: assets
    };

    return index;
});