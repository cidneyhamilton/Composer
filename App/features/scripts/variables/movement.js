define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.type = 'variables.movement';
    ctor.prototype.displayName = 'Movement Status';

    ctor.prototype.getDescription = function(){
        return "Ego's Movement Status";
    }

    return ctor;
});