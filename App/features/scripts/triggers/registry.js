﻿define(function(require) {
    var serializer = require('plugins/serializer');
    var selectedGame = require('features/projectSelector/index');

    // Determine if we should show only the basic nodes, or all nodes for 3D scripting
    var showAdvanced = selectedGame.activeProject.format == 'json';

    var baseTriggers = [
        require('./enter'),
        require('./manual'),
    ];

    // These nodes are only used in Summer Daze.
    // TODO: more generic handling?
    var inkOnlyTriggers = [
	require('./map'),
	require('./dealCards'),
	require('./playerWin'),
	require('./playerLose'),
	
	require('./playerBomb'),
	require('./playerWater'),
	require('./villainBomb'),
	require('./villainWater')
    ];

    var advanced = [
            require('./interact'),
            require('./acquireItem'),
            require('./bootstrap'),
            require('./checkAchievements'),
            require('./defeatedEgo'),
            require('./demerits'),
            require('./equipItem'),
            require('./firstenter'),
            require('./itemPurchased'),
            require('./killedByEgo'),
            require('./killedEgo'),
            require('./load'),
            require('./look'),
            require('./loot'),
            require('./poobah'),
            require('./resetDay'),
            require('./runaway'),
            require('./spottedEgo'),
            require('./unequipItem'),
            require('./use'),
            require('./zone'),
            require('./sceneMusic'),
            require('./noNav')
        ];

    return {
        base: baseTriggers.concat(inkOnlyTriggers),
        all: baseTriggers.concat(advanced),
        install: function() {
            this.all.forEach(function(type) { serializer.registerType(type); });
        }
    };
});
