define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.value = attributes.value || '';
        this.min = attributes.min || 1;
        this.max = attributes.max || 100;
    };

    ctor.type = 'variables.random';
    ctor.prototype.displayName = 'Random';

    ctor.prototype.localize = function (context) {
        context.addLocalizationEntry(this.value, this.value);
    };

    ctor.prototype.getDescription = function(){
        return "Random Value: [" + this.min + " , " + this.max + "]";
    }

    return ctor;
});