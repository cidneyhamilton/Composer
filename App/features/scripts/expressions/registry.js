define(function(require) {
    var serializer = require('plugins/serializer');

    return {
        addableExpressions: [
            require('./actorPresent'),
            require('./inTags'),
            require('./inInventory'),
            require('./inventoryItemSelected'),
            require('./enteredScene'),
            require('./variableComparison'),
            require('./reputationComparison'),
            require('./skillCheck'),
            require('./inEvent'),
            require('./previousScene'),
            require('./currentScene'),
            require('./propStatus'),
            require('./isEquipped'),
            require('./isAlphaBuild'),
            require('./debugOnly'),
            require('./hasActiveQuest'),
            require('./hasAchievement'),
            require('./isPoisoned'),
            require('./nextScene'),
            require('./movementStatus')
        ],
        install: function() {
            this.addableExpressions.forEach(function(type) { serializer.registerType(type); });
            serializer.registerType(require('./and'));
            serializer.registerType(require('./or'));
        }
    };
});