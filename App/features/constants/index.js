define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        ConstantEditor = require('./constantEditor'),
        Index = require('features/shared/index');

    var ctor = function() {
        Index.call(this, assetDatabase.constants, ConstantEditor);
    };

    Index.baseOn(ctor);

    return new ctor();
});