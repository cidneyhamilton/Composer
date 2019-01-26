define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.type = 'variables.day';
    ctor.prototype.displayName = 'Day';

    ctor.prototype.getDescription = function(){
        return "the Current Day.";
    }

    return ctor;
});