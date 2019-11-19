define(function(require) {
    var serializer = require('plugins/serializer');
    var selectedGame = require('features/projectSelector/index');

    // Determine if we should show only the basic nodes, or all nodes for 3D scripting
    var showAdvanced = selectedGame.activeProject.format == 'json';

    // Nodes that should appear even in simple visual novel-style games
    var baseNodes = [
        require('./speak'),
        require('./branch'),
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
        require('./changeTags'),
        require('./setVariable'),
    ];

    // Nodes that should only appear in full games
    // TODO -- Make these separate dropdowns in the UI?
    var advancedNodes = [
        require('./achievements'),
        require('./addStoreStock'),
        require('./autosave'),
        require('./buffAdd'),
        require('./changeHealth'),
        require('./changeScene'),
        require('./changeStoryEvent'),
        require('./clearStoreStock'),
        require('./endScript'),
        require('./fade'),
        require('./futureScript'),
        require('./hideCloseUp'),
        require('./hideVignette'),
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
        require('./questionAndAnswer'),
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
        require('./showStore'),
        require('./showVignette'),
        require('./stopPlayer'),
        require('./trace'),
        require('./turnActor'),
        require('./useItem'),
        require('./skillBranch'),
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
