define(function(require){
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.sections = attributes.sections || [];
    };

    ctor.type = 'nodes.branch';
    ctor.displayName = 'Branch';

    ctor.prototype.localize = function(localizationId, context){
        var i = 0;
        this.sections.forEach(function(x){
            x.localize(localizationId + " Branch #" + (i++), context); 
        });
    };

    return ctor;
});