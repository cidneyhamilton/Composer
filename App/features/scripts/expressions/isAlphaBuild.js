define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};
        this.type = ctor.type;
    };

    ctor.prototype.getDescription = function() {
        return '<span class="prop"> IS ALPHA BUILD </span>';
    };

    ctor.type = 'expressions.isAlphaBuild';
    ctor.displayName = 'isAlphaBuild';

    return ctor;
});