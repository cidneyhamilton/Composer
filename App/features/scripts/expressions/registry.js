define(function(require) {
    var serializer = require('plugins/serializer');


    // Define a basic and advanced list of variable sources
    var addableExpressions = [
        require('./variableComparison'),
        require('./reputationComparison'),
        require('./inTags'),
        require('./demoOnly')
    ];
    
    var advancedExpressions = [
            require('./actorPresent'),
            require('./inInventory'),
            require('./inventoryItemSelected'),
            require('./enteredScene'),
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
        ];


    return {
        baseExpressions: addableExpressions,
        advancedExpressions: advancedExpressions,
        addableExpressions: addableExpressions.concat(advancedExpressions),
        install: function() {
            this.addableExpressions.forEach(function(type) { serializer.registerType(type); });
            serializer.registerType(require('./and'));
            serializer.registerType(require('./or'));
        }
    };
});