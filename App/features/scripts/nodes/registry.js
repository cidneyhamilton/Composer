define(function(require) {
    var serializer = require('plugins/serializer');

    // TODO -- Make these friendlier?
    return {
        addableNodes: [
            require('./speak'),
            require('./achievements'),
            require('./addStoreStock'),
            require('./autosave'),
            require('./branch'),
            require('./buffAdd'),
            require('./changeHealth'),
            require('./changeScene'),
            require('./changeStoryEvent'),
            require('./clearStoreStock'),
            require('./comment'),
            require('./nodeCycle'),
            require('./endScript'),
            require('./fade'),
            require('./futureScript'),
            require('./gameOver'),
            require('./hideCloseUp'),
            require('./hideVignette'),
            require('./incrementTime'),
            require('./changeInventory'),
            require('./improveSkill'),
            require('./invokeCommand'),
            require('./invokeScript'),
            require('./addJournalEntry'),
            require('./showMenu'),
            require('./minigame'),
            require('./moveactor'),
            require('./noCombineMatch'),
            require('./onceOnly'),
            require('./onceDaily'),
            require('./placeActor'),
            require('./playAnimation'),
            require('./playSoundEffect'),
            require('./playMovie'),
            require('./playMusic'),
            require('./playPoobah'),
            require('./poisonCounters'),
            require('./changeMoney'), // Player Value
            require('./changePropVisibility'),
            require('./questionAndAnswer'),
            require('./quests'),
            require('./changeReputation'),
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
            require('./speak'),
            require('./stopPlayer'),
            require('./changeTags'),
            require('./trace'),
            require('./turnActor'),
            require('./setVariable'),
            require('./useItem'),
            require('./skillBranch'),
            require('./wait')  
        ],
        install: function() {
            this.addableNodes.forEach(function(type) { serializer.registerType(type); });
            serializer.registerType(require('./branchSection'));
            serializer.registerType(require('./block'));
        }
    };
});