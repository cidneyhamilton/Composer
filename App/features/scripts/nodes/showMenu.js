define(function(require){
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.options = attributes.options || [];

        this.AutoAddDone = attributes.AutoAddDone;
        this.Unique = attributes.Unique || null;

        if (this.AutoAddDone == null)
            this.AutoAddDone = true;

        if (this.Unique == null) {
            this.Unique = false;
        }
    };

    ctor.type = 'nodes.showMenu';
    ctor.displayName = 'Menu';

    ctor.prototype.localize = function(context){
        this.options.forEach(function(x){
            if(x.localize){
                x.localize(context);
            }
        });
    };

    return ctor;
});