define(function(require){
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.nodes = attributes.nodes || [];
    };

    ctor.type = 'nodes.block';

    ctor.prototype.localize = function(context){
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(context);
            }
        });
    };

    return ctor;
});