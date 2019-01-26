define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.id = attributes.id;
        this.name = attributes.name;
        this.description = attributes.description;
        this.components = attributes.components || [];
        this.notes = attributes.notes || "";
    };

    ctor.type = 'actor';

    ctor.prototype.localize = function(context){
        context.addLocalizationEntry(this.id, this.name);
        delete this.name;

        context.addLocalizationEntry(this.id + '_Description', this.description, this.notes);
        delete this.description;
    };

    return ctor;
});