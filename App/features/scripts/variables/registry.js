define(function (require) {
    var serializer = require('plugins/serializer');

    return {
        addableSources: [
            require('./literal'),
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
        ],
        install: function () {
            this.addableSources.forEach(function (type) { serializer.registerType(type); });
        }
    };
});