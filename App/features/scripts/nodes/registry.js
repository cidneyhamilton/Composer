﻿define(function(require) {
    var serializer = require('plugins/serializer');
    var selectedGame = require('features/projectSelector/index');

    // Determine if we should show only the basic nodes, or all nodes for 3D scripting
    var showAdvanced = selectedGame.activeProject.format == 'json';

    // Nodes that should appear even in simple visual novel-style games
    var baseNodes = [
        require('./speak'),
        require('./branch'),
	require('./changeScene'),
        require('./comment'),
        require('./nodeCycle'),
        require('./gameOver'),
        require('./improveSkill'),
        require('./invokeCommand'),
        require('./invokeScript'),
        require('./showMenu'),
        require('./placeActor'),
        require('./playMusic'),
        require('./playSoundEffect'),
        require('./removeActor'),
	require('./changeMoney'), // Change Player Value
	require('./changePropVisibility'),
        require('./changeReputation'),
	require('./questionAndAnswer'),
	require('./showStore'),
	require('./changeTags'),
        require('./setVariable'),
	require('./showVignette'),
	require('./hideVignette'),
	require('./fade')
    ];
    
    // Nodes that should only appear in full games
    // TODO -- Make these separate dropdowns in the UI?
    var advancedNodes = [
        require('./achievements'),
        require('./addStoreStock'),
        require('./autosave'),
        require('./buffAdd'),
        require('./changeHealth'),
        require('./changeStoryEvent'),
        require('./clearStoreStock'),
        require('./endScript'),
        require('./futureScript'),
        require('./hideCloseUp'),
        require('./incrementTime'),
        require('./changeInventory'),
        require('./addJournalEntry'),
        require('./minigame'),
        require('./moveactor'),
        require('./noCombineMatch'),
        require('./onceOnly'),
        require('./onceDaily'),
        require('./playAnimation'),
        require('./playMovie'),
        require('./playPoobah'),
        require('./poisonCounters'),
        require('./quests'),
        require('./resetCamera'),
        require('./selectInventoryItem'),
        require('./sellAllLoot'),
        require('./setCameraTarget'),
        require('./setCameraFov'),
        require('./setTime'),
        require('./setTimer'),
        require('./showCloseUp'),
        require('./showDescription'),
	require('./skillBranch'),
        require('./stopPlayer'),
        require('./trace'),
        require('./turnActor'),
        require('./useItem'),
        require('./wait')  
    ];

    return {
        baseNodes: baseNodes,
        advancedNodes: advancedNodes,
        addableNodes: baseNodes.concat(advancedNodes),
        install: function() {
            this.addableNodes.forEach(function(type) { serializer.registerType(type); });
            serializer.registerType(require('./branchSection'));
            serializer.registerType(require('./block'));
        }
    };
});
