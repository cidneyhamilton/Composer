define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};
        this.type = ctor.type;
    };

    ctor.prototype.getDescription = function() {
        return '<span class="prop"> DEMO ONLY </span>';
    };

    ctor.type = 'expressions.demoOnly';
    ctor.displayName = 'DemoOnly';

    return ctor;
});