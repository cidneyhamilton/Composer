define(function(require) {
    var serializer = require('plugins/serializer');

    return {
        all: [
            require('./interact'),
            require('./acquireItem'),
            require('./bootstrap'),
            require('./checkAchievements'),
            require('./defeatedEgo'),
            require('./demerits'),
            require('./enter'),
            require('./equipItem'),
            require('./firstenter'),
            require('./itemPurchased'),
            require('./killedByEgo'),
            require('./killedEgo'),
            require('./load'),
            require('./look'),
            require('./loot'),
            require('./manual'),
            require('./poobah'),
            require('./resetDay'),
            require('./runaway'),
            require('./spottedEgo'),
            require('./unequipItem'),
            require('./use'),
            require('./zone'),
            require('./sceneMusic'),
            require('./noNav')
        ],
        install: function() {
            this.all.forEach(function(type) { serializer.registerType(type); });
        }
    };
});