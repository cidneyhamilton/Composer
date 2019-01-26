define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.id = attributes.id;
        this.name = attributes.name;
        this.components = attributes.components || [];
        this.notes = attributes.notes || "";
    };

    ctor.type = 'storyEvent';

    ctor.prototype.localize = function(context){
        context.addLocalizationEntry(this.id, this.name, this.notes);
        delete this.name;
    };

    return ctor;
});