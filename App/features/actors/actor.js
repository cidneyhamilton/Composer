define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.id = attributes.id;
        this.name = attributes.name;
        this.description = attributes.description;
        this.components = attributes.components || [];
        this.notes = attributes.notes || "";
        this.displayName = attributes.displayName;
    };
    
    ctor.type = 'actor';

    ctor.prototype.localize = function(context){
        var actualDisplayName = (!!this.displayName) ? this.displayName : this.name;
        var localizationId = 'Actor: ' + actualDisplayName;
        context.addLocalizationEntry(localizationId, this.id, actualDisplayName);
        delete this.name;

        context.addLocalizationEntry(localizationId + " (Description)", this.id + '_Description', this.description, this.notes);
        delete this.description;
    };

    return ctor;
});