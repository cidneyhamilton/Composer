define(function(require){
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.expression = attributes.expression || null;
        this.nodes = attributes.nodes || [];
    };

    ctor.type = 'nodes.branchSection';

    ctor.prototype.localize = function(localizationId, context){
        var i = 0;
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(localizationId + " BranchSection #" + (i++), context);
            }
        });
    };

    return ctor;
});
