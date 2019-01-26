define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.id = attributes.id;
        this.name = attributes.name;
        this.description = attributes.description;
        this.components = attributes.components || [];
        this.notes = attributes.notes || "";
        this.sceneId = attributes.sceneId;
        this.value = attributes.value || 0;
        this.weight = attributes.weight || 0;
        this.displayName = attributes.displayName;
    };

    ctor.type = 'prop';

    ctor.prototype.localize = function(context){
        context.addLocalizationEntry(this.id, (!!this.displayName) ? this.displayName : this.name);
        delete this.name;

        context.addLocalizationEntry(this.id + '_Description', this.description, this.notes);
        delete this.description;
    };

    return ctor;
});