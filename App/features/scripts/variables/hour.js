define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.type = 'variables.hour';
    ctor.prototype.displayName = 'Hour';

    ctor.prototype.getDescription = function(){
        return "the Current Hour.";
    }

    return ctor;
});