define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.prototype.getDescription = function(){
        return 'Is Poisoned';
    };

    ctor.type = 'expressions.isPoisoned';
    ctor.displayName = 'Is Poisoned';

    return ctor;
});