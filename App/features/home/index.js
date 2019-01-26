﻿define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var index = {
        assets: [
            assetDatabase.storyEvents,
            assetDatabase.scenes,
            assetDatabase.actors,
            assetDatabase.props,
            assetDatabase.scripts
        ]
    };

    return index;
});