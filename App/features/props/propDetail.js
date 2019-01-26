define(function(require) {
    var ComponentIndex = require('features/components/index');

    var ctor = function() {
        this.name = 'Main';
        this.componentIndex = new ComponentIndex('440px');
    };

    return ctor;
});