define(function (require) {
    var serializer = require('plugins/serializer');


    // Define a basic and advanced list of variable sources
    var addableSources = [
        require('./literal')
    ];
    
    var advancedSources = [
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
    ];


    return {
        baseSources: addableSources,
        addableSources: addableSources.concat(advancedSources),
        install: function () {
            this.addableSources.forEach(function (type) { serializer.registerType(type); });
        }
    };
});