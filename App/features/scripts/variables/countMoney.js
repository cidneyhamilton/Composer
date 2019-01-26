define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.type = 'variables.countMoney';
    ctor.prototype.displayName = 'Count Money';

    ctor.prototype.getDescription = function(){
        return "the Egos total Lira.";
    }

    return ctor;
});