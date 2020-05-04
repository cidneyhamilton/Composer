define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.nodes = attributes.nodes || [];
    };

    ctor.type = 'nodes.onceOnly';
    ctor.displayName = 'Once Only';

    ctor.prototype.localize = function(localizationId, context){
        var i = 0;
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(localizationId + " OnceOnly#" + (i++), context);
            }
        });
    };

    return ctor;
});