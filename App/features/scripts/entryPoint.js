define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id;
        this.name = attributes.name;
        this.nodes = attributes.nodes || [];
    };

    ctor.type = 'scripts.entryPoint';

    ctor.prototype.localize = function(localizationIdBase, context){
        var i = 0;
        var entrypointName = this.name;
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(localizationIdBase + " EP: " + entrypointName + " #" + (i++), context);
            }
        });
    };

    return ctor;
});