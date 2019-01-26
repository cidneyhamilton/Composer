define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id;
        this.name = attributes.name;
        this.nodes = attributes.nodes || [];
    };

    ctor.type = 'scripts.entryPoint';

    ctor.prototype.localize = function(context){
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(context);
            }
        });
    };

    return ctor;
});