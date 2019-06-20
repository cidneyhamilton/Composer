define(function (require) {
    var serializer = require('plugins/serializer'),
        selectedGame = require('features/projectSelector/index');


    // Define a basic and advanced list of variable sources
    var addableSources = [
        require('./literal')
    ];
    
    if (selectedGame.showAdvanced) {
        addableSources.concat([
            require('./movement'),
            require('./count'),
            require('./countDemerits'),
            require('./countMoney'),
            require('./skillName'),
            require('./skillValueName'),
            require('./day'),
            require('./hour'),
            require('./random'),
            require('./scopedVariable'),
            require('./killCount')
        ]);
    };


    return {
        addableSources: addableSources,
        install: function () {
            this.addableSources.forEach(function (type) { serializer.registerType(type); });
        }
    };
});