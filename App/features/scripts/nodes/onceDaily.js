define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.nodes = attributes.nodes || [];
    };

    ctor.type = 'nodes.onceDaily';
    ctor.displayName = 'Once Daily';

    ctor.prototype.localize = function(localizationId, context){
        var i = 0;
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(localizationId + " OnceDaily #" + (i++), context);
            }
        });
    };

    return ctor;
});