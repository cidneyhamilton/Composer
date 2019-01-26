define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
    };

    ctor.type = 'variables.countDemerits';
    ctor.prototype.displayName = 'Count Demerits';

    ctor.prototype.getDescription = function(){
        return "the Egos total Demerits.";
    }

    return ctor;
});