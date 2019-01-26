define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        GroupEditor = require('./groupEditor'),
        Index = require('features/shared/index');

    var ctor = function() {
        Index.call(this, assetDatabase.localizationGroups, GroupEditor);
    };

    Index.baseOn(ctor);

    return new ctor();
});