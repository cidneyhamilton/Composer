define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.value = attributes.value || '';
        this.notes = attributes.notes || "";
    };

    ctor.type = 'variables.literal';
    ctor.prototype.displayName = 'Literal';

    ctor.prototype.localize = function (localizationId, context) {
        context.addLocalizationEntry(localizationId + this.value, this.value, this.value, this.notes);
    };

    ctor.prototype.getDescription = function(){
        return "Literal Value: " + this.value;
    }

    return ctor;
});