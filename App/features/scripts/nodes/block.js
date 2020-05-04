define(function(require){
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.nodes = attributes.nodes || [];
    };

    ctor.type = 'nodes.block';

    ctor.prototype.localize = function(localizationId, context){
        var i = 0;
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(localizationId + " Block#" + (i++), context);
            }
        });
    };

    return ctor;
});