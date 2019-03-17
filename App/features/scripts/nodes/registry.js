define(function(require) {
    var serializer = require('plugins/serializer');
    var selectedGame = require('features/projectSelector/index');

    // Determine if we should show only the basic nodes, or all nodes for 3D scripting
    var showAdvanced = selectedGame.activeProject.format == 'json';

    // Nodes that should appear even in simple visual novel-style games
    var baseNodes = [
        require('./speak'),
        require('./branch'),
        require('./showMenu'),
        require('./changeReputation'),
        require('./changeScene'),
        require('./changeTags'),
        require('./comment'),
        require('./gameOver'),
        require('./nodeCycle'),
        require('./invokeCommand'),
        require('./invokeScript'),
        require('./setVariable'),
        require('./playMusic'),
        require('./playSoundEffect'),
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
        require('./fade'),
        require('./futureScript'),
        require('./hideCloseUp'),
        require('./hideVignette'),
        require('./incrementTime'),
        require('./changeInventory'),
        require('./improveSkill'),
        require('./addJournalEntry'),
        require('./minigame'),
        require('./moveactor'),
        require('./noCombineMatch'),
        require('./onceOnly'),
        require('./onceDaily'),
        require('./placeActor'),
        require('./playAnimation'),
        require('./playMovie'),
        require('./playPoobah'),
        require('./poisonCounters'),
        require('./changeMoney'), // Player Value
        require('./changePropVisibility'),
        require('./questionAndAnswer'),
        require('./quests'),
        require('./removeActor'),
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
        require('./showWardrobe'),
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