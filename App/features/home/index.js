define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
    selectedGame = require('features/projectSelector/index');

    // All games use constants, scenes, actors, and scripts
    var assets = [
            assetDatabase.constants,
            assetDatabase.scenes,
            assetDatabase.actors,
            assetDatabase.scripts
        ];

    // In the advanced version of the game, include events and props
    if (selectedGame.showAdvanced) {
        assets.push(assetDatabase.storyEvents);
        assets.push(assetDatabase.props);
    }

    var index = {
        assets: assets
    };

    return index;
});